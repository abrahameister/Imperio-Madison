import { chromium, type Page } from 'playwright';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

// Cargar variables de entorno (desde .env.local para pruebas locales, o inyectadas por GitHub Actions)
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Faltan credenciales de Supabase (URL o SERVICE_ROLE_KEY).');
  process.exit(1);
}

// Inicializar cliente con SERVICE_ROLE para hacer bypass del RLS (necesario para hacer UPDATE)
const supabase = createClient(supabaseUrl, supabaseKey);

interface Producto {
  id: string;
  nombre: string;
  url_lider: string | null;
  url_jumbo: string | null;
  url_tottus: string | null;
}

// ── Helpers de Evasión Anti-Bot ──
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const randomSleep = (min = 2000, max = 5000) => sleep(Math.floor(Math.random() * (max - min + 1) + min));

/**
 * Función genérica y robusta para extraer el precio de una página.
 * Intenta buscar meta properties (la forma estándar y oficial).
 * Si no los encuentra, busca patrones de texto con el símbolo "$" y extrae el valor más lógico.
 */
async function extractPrice(page: Page, url: string): Promise<number | null> {
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    
    // Evasión: Tiempo aleatorio para imitar lectura humana antes de extraer
    await randomSleep(2500, 5500);

    const price = await page.evaluate(() => {
      // 1. Estrategia limpia: Schema.org o JSON-LD
      const metaPrice = document.querySelector('meta[itemprop="price"], meta[property="product:price:amount"]');
      if (metaPrice && metaPrice.getAttribute('content')) {
        const parsed = parseInt(metaPrice.getAttribute('content')!.replace(/\D/g, ''), 10);
        if (!isNaN(parsed) && parsed > 0) return parsed;
      }

      // 2. Estrategia heurística (Fuerza bruta sobre el DOM para evadir cambios de CSS de los supermercados)
      const elementsWithMoney = Array.from(document.querySelectorAll('*'))
        .filter(el => {
            // Solo elementos hoja o con un solo hijo de texto directo
            return (!el.children || el.children.length === 0) && el.textContent && el.textContent.includes('$');
        });

      for (const el of elementsWithMoney) {
        const text = el.textContent || '';
        // Buscar patrón tipo "$ 1.990" o "$1990"
        const match = text.match(/\$\s*([\d,.]+)/);
        if (match) {
          const numberStr = match[1].replace(/[^\d]/g, ''); // Limpiar puntos y comas
          const parsed = parseInt(numberStr, 10);
          // Filtrar precios irreales (ej. $0, o valores muy pequeños que podrían ser "despacho desde $990" o descuentos)
          if (!isNaN(parsed) && parsed > 100) {
              // Heurística visual simple: los precios principales suelen tener fuentes grandes
              const fontSize = window.getComputedStyle(el).fontSize;
              const size = parseFloat(fontSize);
              if (size > 14) {
                 return parsed;
              }
          }
        }
      }

      return null;
    });

    return price;
  } catch (err) {
    console.error(`    ⚠️ Error al cargar ${url}: ${(err as Error).message}`);
    return null; // No crashear, devolver null para continuar
  }
}

async function runScraper() {
  console.log('🚀 Iniciando Scraper Bot de Imperio Madison...\n');

  // 1. Obtener productos activos de Supabase
  const { data: productos, error } = await supabase
    .from('productos')
    .select('id, nombre, url_lider, url_jumbo, url_tottus');

  if (error || !productos) {
    console.error('❌ Error obteniendo productos de Supabase:', error);
    process.exit(1);
  }

  // Filtrar productos que tengan al menos una URL configurada
  const targets = (productos as Producto[]).filter(p => p.url_lider || p.url_jumbo || p.url_tottus);
  
  if (targets.length === 0) {
    console.log('✅ No hay productos con URLs configuradas. Fin del proceso.');
    process.exit(0);
  }

  console.log(`📦 Encontrados ${targets.length} productos para analizar.\n`);

  // 2. Iniciar navegador Playwright (Headless = true para GitHub Actions)
  const browser = await chromium.launch({
    headless: true,
  });

  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    viewport: { width: 1920, height: 1080 },
    locale: 'es-CL',
  });

  const page = await context.newPage();

  // 3. Iterar productos
  for (const product of targets) {
    console.log(`🔍 Analizando: ${product.nombre} (ID: ${product.id})`);
    
    const newPrices: Record<string, number> = {};

    // Lider
    if (product.url_lider) {
      console.log(`  ➡️ Scrapeando Lider...`);
      const price = await extractPrice(page, product.url_lider);
      if (price) {
        console.log(`    ✅ Encontrado: $ ${price}`);
        newPrices.precio_lider = price;
      }
    }

    // Jumbo
    if (product.url_jumbo) {
      console.log(`  ➡️ Scrapeando Jumbo...`);
      const price = await extractPrice(page, product.url_jumbo);
      if (price) {
        console.log(`    ✅ Encontrado: $ ${price}`);
        newPrices.precio_jumbo = price;
      }
    }

    // Tottus
    if (product.url_tottus) {
      console.log(`  ➡️ Scrapeando Tottus...`);
      const price = await extractPrice(page, product.url_tottus);
      if (price) {
        console.log(`    ✅ Encontrado: $ ${price}`);
        newPrices.precio_tottus = price;
      }
    }

    // 4. Actualizar Supabase (solo si encontramos algún precio nuevo)
    if (Object.keys(newPrices).length > 0) {
      console.log('  💾 Actualizando base de datos...');
      const { error: updateErr } = await supabase
        .from('precios')
        .update({
          ...newPrices,
          updated_at: new Date().toISOString()
        })
        .eq('producto_id', product.id);

      if (updateErr) {
        console.error('    ❌ Error al actualizar Supabase:', updateErr.message);
      } else {
        console.log('    ✅ Supabase actualizado exitosamente.');
      }
    } else {
      console.log('  ⚠️ No se encontraron precios nuevos válidos para actualizar.');
    }

    console.log('--------------------------------------------------');
  }

  // 5. Limpieza
  await context.close();
  await browser.close();
  
  console.log('\n🏁 Proceso finalizado con éxito.');
}

runScraper().catch(console.error);
