

var fs = require('fs');
var path = require('path');
var pageDir = __dirname;
var outputFile = path.join(pageDir, 'todolist.md');
var SEO_CRITERIA = {
    textMinLength: 2500,        // text.tr minimum karakter sayısı (HTML tag'leri hariç)
    descriptionMaxLength: 180,  // description.tr maksimum karakter sayısı
    keywordMaxLength: 180,      // keyword.tr maksimum karakter sayısı
    spotMaxLength: 180,         // spot.tr maksimum karakter sayısı
    nameMaxLength: 100         // name.tr maksimum karakter sayısı
};
function stripHtmlTags(html) {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}
function getTextLength(text) {
    return stripHtmlTags(text).length;
}
function hasFAQSection(text) {
    if (!text) return false;
    var cleanText = stripHtmlTags(text).toLowerCase();
    var faqIndicators = [
        'soru',
        'cevap',
        'faq',
        'sık sorulan',
        'nasıl',
        'neden',
        'ne zaman',
        'nerede',
        'kim',
        'hangi',
        '?'
    ];
    var questionMarks = (text.match(/\?/g) || []).length;
    var hasQuestionWords = faqIndicators.some(function(indicator) {
        return cleanText.includes(indicator);
    });
    
    return questionMarks >= 2 || (hasQuestionWords && questionMarks >= 1);
}
function analyzePage(filePath, pageId) {
    try {
        var content = fs.readFileSync(filePath, 'utf8');
        var pageData = JSON.parse(content);
        
        var issues = [];
        var warnings = [];
        if (!pageData.name || !pageData.name.tr) {
            issues.push('❌ **name.tr** alanı eksik');
        } else {
            if (pageData.name.tr.length > SEO_CRITERIA.nameMaxLength) {
                issues.push('❌ **name.tr** çok uzun (' + pageData.name.tr.length + ' harf, max: ' + SEO_CRITERIA.nameMaxLength + ')');
            }
            if (!pageData.name.en) {
                warnings.push('⚠️ **name.en** çevirisi eksik');
            }
        }
        if (!pageData.description || !pageData.description.tr) {
            issues.push('❌ **description.tr** alanı eksik');
        } else {
            if (pageData.description.tr.length > SEO_CRITERIA.descriptionMaxLength) {
                issues.push('❌ **description.tr** çok uzun (' + pageData.description.tr.length + ' harf, max: ' + SEO_CRITERIA.descriptionMaxLength + ')');
            }
            if (!pageData.description.en) {
                warnings.push('⚠️ **description.en** çevirisi eksik');
            }
        }
        if (!pageData.keyword || !pageData.keyword.tr) {
            issues.push('❌ **keyword.tr** alanı eksik');
        } else {
            if (pageData.keyword.tr.length > SEO_CRITERIA.keywordMaxLength) {
                issues.push('❌ **keyword.tr** çok uzun (' + pageData.keyword.tr.length + ' harf, max: ' + SEO_CRITERIA.keywordMaxLength + ')');
            }
            if (!pageData.keyword.en) {
                warnings.push('⚠️ **keyword.en** çevirisi eksik');
            }
        }
        if (!pageData.spot || !pageData.spot.tr) {
            issues.push('❌ **spot.tr** alanı eksik');
        } else {
            if (pageData.spot.tr.length > SEO_CRITERIA.spotMaxLength) {
                issues.push('❌ **spot.tr** çok uzun (' + pageData.spot.tr.length + ' harf, max: ' + SEO_CRITERIA.spotMaxLength + ')');
            }
            if (!pageData.spot.en) {
                warnings.push('⚠️ **spot.en** çevirisi eksik');
            }
        }
        if (!pageData.text || !pageData.text.tr) {
            issues.push('❌ **text.tr** alanı eksik');
        } else {
            var textLength = getTextLength(pageData.text.tr);
            if (textLength < SEO_CRITERIA.textMinLength) {
                issues.push('❌ **text.tr** çok kısa (' + textLength + ' harf, min: ' + SEO_CRITERIA.textMinLength + ' harf olmalı)');
            }
            if (!hasFAQSection(pageData.text.tr)) {
                issues.push('❌ **text.tr** içinde soru-cevap (FAQ) bölümü eksik');
            }
            
            if (!pageData.text.en) {
                warnings.push('⚠️ **text.en** çevirisi eksik');
            }
        }
        
        return {
            pageId: pageId,
            pageName: pageData.name ? (pageData.name.tr || pageData.name.en || pageId) : pageId,
            path: pageData.path || '',
            issues: issues,
            warnings: warnings,
            hasIssues: issues.length > 0,
            hasWarnings: warnings.length > 0
        };
    } catch (error) {
        return {
            pageId: pageId,
            pageName: pageId,
            path: '',
            issues: ['❌ **Dosya okuma hatası:** ' + error.message],
            warnings: [],
            hasIssues: true,
            hasWarnings: false
        };
    }
}
function analyzeAllPages() {
    var results = [];
    var totalPages = 0;
    var pagesWithIssues = 0;
    var pagesWithWarnings = 0;
    
    console.log('📊 Sayfa analizi başlatılıyor...\n');
    var dirs = fs.readdirSync(pageDir);
    
    dirs.forEach(function(dir) {
        var dirPath = path.join(pageDir, dir);
        var stat = fs.statSync(dirPath);
        if (stat.isDirectory() && dir !== 'node_modules' && dir !== '.git') {
            var indexPath = path.join(dirPath, 'index.json');
            
            if (fs.existsSync(indexPath)) {
                totalPages++;
                var analysis = analyzePage(indexPath, dir);
                results.push(analysis);
                
                if (analysis.hasIssues) {
                    pagesWithIssues++;
                }
                if (analysis.hasWarnings) {
                    pagesWithWarnings++;
                }
                if (totalPages % 50 === 0) {
                    console.log('  ✓ ' + totalPages + ' sayfa analiz edildi...');
                }
            }
        }
    });
    
    console.log('\n✅ Analiz tamamlandı!');
    console.log('   Toplam sayfa: ' + totalPages);
    console.log('   Sorunlu sayfa: ' + pagesWithIssues);
    console.log('   Uyarılı sayfa: ' + pagesWithWarnings + '\n');
    
    return {
        results: results,
        stats: {
            total: totalPages,
            withIssues: pagesWithIssues,
            withWarnings: pagesWithWarnings
        }
    };
}
function generateTodoList(analysisData) {
    var md = [];
    md.push('# 📋 SEO ve Dil İyileştirme Todo Listesi');
    md.push('');
    md.push('**Oluşturulma Tarihi:** ' + new Date().toLocaleString('tr-TR'));
    md.push('');
    md.push('## 📊 Özet İstatistikler');
    md.push('');
    md.push('- **Toplam Sayfa:** ' + analysisData.stats.total);
    md.push('- **Sorunlu Sayfa:** ' + analysisData.stats.withIssues);
    md.push('- **Uyarılı Sayfa:** ' + analysisData.stats.withWarnings);
    md.push('');
    var criticalPages = analysisData.results.filter(function(r) { return r.hasIssues; });
    var warningPages = analysisData.results.filter(function(r) { return !r.hasIssues && r.hasWarnings; });
    var okPages = analysisData.results.filter(function(r) { return !r.hasIssues && !r.hasWarnings; });
    if (criticalPages.length > 0) {
        md.push('## 🔴 Kritik Sorunlar (' + criticalPages.length + ' sayfa)');
        md.push('');
        md.push('> **Öncelik:** Bu sayfalar SEO açısından kritik sorunlar içeriyor. Öncelikle bunlar düzeltilmeli.');
        md.push('');
        
        criticalPages.forEach(function(page, index) {
            var cleanPageName = page.pageName
                .replace(/fiyat[ılar]*/gi, 'fiyatlandırma')
                .replace(/\d+\s*(tl|gbp|eur|usd|£|€|\$)/gi, '')
                .replace(/\d+\s*(gün|hafta|ay|yıl)/gi, 'süre')
                .replace(/\d+/g, '')
                .trim();
            
            md.push('### ' + (index + 1) + '. ' + cleanPageName);
            md.push('');
            md.push('- **Sayfa ID:** `' + page.pageId + '`');
            md.push('- **Path:** `' + (page.path || 'belirtilmemiş') + '`');
            md.push('- **Dosya:** `page/' + page.pageId + '/index.json`');
            md.push('');
            md.push('**Sorunlar:**');
            page.issues.forEach(function(issue) {
                md.push('- ' + issue);
            });
            
            if (page.warnings.length > 0) {
                md.push('');
                md.push('**Uyarılar:**');
                page.warnings.forEach(function(warning) {
                    md.push('- ' + warning);
                });
            }
            
            md.push('');
            md.push('---');
            md.push('');
        });
    }
    if (warningPages.length > 0) {
        md.push('## ⚠️ Uyarılar (' + warningPages.length + ' sayfa)');
        md.push('');
        md.push('> **Not:** Bu sayfalar çeviri eksiklikleri içeriyor. SEO için önemli ancak kritik değil.');
        md.push('');
        
        warningPages.forEach(function(page, index) {
            var cleanPageName = page.pageName
                .replace(/fiyat[ılar]*/gi, 'fiyatlandırma')
                .replace(/\d+\s*(tl|gbp|eur|usd|£|€|\$)/gi, '')
                .replace(/\d+\s*(gün|hafta|ay|yıl)/gi, 'süre')
                .replace(/\d+/g, '')
                .trim();
            
            md.push('### ' + (index + 1) + '. ' + cleanPageName);
            md.push('');
            md.push('- **Sayfa ID:** `' + page.pageId + '`');
            md.push('- **Path:** `' + (page.path || 'belirtilmemiş') + '`');
            md.push('- **Dosya:** `page/' + page.pageId + '/index.json`');
            md.push('');
            md.push('**Uyarılar:**');
            page.warnings.forEach(function(warning) {
                md.push('- ' + warning);
            });
            md.push('');
            md.push('---');
            md.push('');
        });
    }
    if (okPages.length > 0) {
        md.push('## ✅ Sorunsuz Sayfalar (' + okPages.length + ' sayfa)');
        md.push('');
        md.push('> Bu sayfalar tüm SEO kriterlerini karşılıyor.');
        md.push('');
    }
    md.push('## 📝 SEO Kriterleri ve Yazım Yönergeleri');
    md.push('');
    md.push('### ✅ Zorunlu Kriterler');
    md.push('');
    md.push('#### 1. Text İçeriği (text.tr)');
    md.push('');
    md.push('- **Minimum uzunluk:** ' + SEO_CRITERIA.textMinLength + ' harf (HTML tag\'leri hariç)');
    md.push('- **Format:** HTML formatında yazılmalı');
    md.push('- **İçerik kalitesi:** SEO odaklı, bilgilendirici ve değer katıcı');
    md.push('- **Soru-cevap bölümü:** Mutlaka içermeli (en az 3-5 soru-cevap)');
    md.push('');
    md.push('#### 2. Meta Bilgiler');
    md.push('');
    md.push('- **name.tr:** Maksimum ' + SEO_CRITERIA.nameMaxLength + ' harf - Sayfa başlığı');
    md.push('- **description.tr:** Maksimum ' + SEO_CRITERIA.descriptionMaxLength + ' harf - SEO açıklaması');
    md.push('- **keyword.tr:** Maksimum ' + SEO_CRITERIA.keywordMaxLength + ' harf - Anahtar kelimeler');
    md.push('- **spot.tr:** Maksimum ' + SEO_CRITERIA.spotMaxLength + ' harf - Kısa özet');
    md.push('');
    md.push('#### 3. Çoklu Dil Desteği');
    md.push('');
    md.push('- Tüm alanlar için **İngilizce (en) çevirisi** olmalı');
    md.push('- Çeviriler profesyonel, doğal ve anlam kaybı olmadan yapılmalı');
    md.push('');
    md.push('---');
    md.push('');
    md.push('## 📖 Detaylı Yazım Yönergeleri');
    md.push('');
    md.push('### 🎯 Text İçeriği Yazım Kuralları');
    md.push('');
    md.push('#### 1. İçerik Yapısı');
    md.push('');
    md.push('Her sayfa içeriği şu bölümleri içermelidir:');
    md.push('');
    md.push('1. **Giriş Bölümü (200-300 harf)**');
    md.push('   - Sayfa konusunu tanıt');
    md.push('   - Okuyucunun ilgisini çek');
    md.push('   - Ana konuyu özetle');
    md.push('');
    md.push('2. **Ana İçerik Bölümü (1500-1800 harf)**');
    md.push('   - Detaylı bilgi ver');
    md.push('   - Konuyu farklı açılardan ele al');
    md.push('   - Örnekler ve senaryolar ekle');
    md.push('   - Avantajları ve özellikleri açıkla');
    md.push('');
    md.push('3. **Soru-Cevap (FAQ) Bölümü (500-700 harf)**');
    md.push('   - En az 3-5 soru-cevap');
    md.push('   - Kullanıcıların merak ettiği konular');
    md.push('   - Detaylı ve bilgilendirici cevaplar');
    md.push('');
    md.push('4. **Sonuç Bölümü (200-300 harf)**');
    md.push('   - Özet bilgi');
    md.push('   - Call-to-action (harekete geçirici ifade)');
    md.push('   - İletişim veya teklif alma yönlendirmesi');
    md.push('');
    md.push('#### 2. HTML Formatı');
    md.push('');
    md.push('İçerik HTML formatında yazılmalı. Kullanılabilecek tag\'ler:');
    md.push('');
    md.push('```html');
    md.push('<p>Paragraf metni</p>');
    md.push('<h2>Alt Başlık</h2>');
    md.push('<h3>Alt Alt Başlık</h3>');
    md.push('<ul>');
    md.push('  <li>Liste öğesi 1</li>');
    md.push('  <li>Liste öğesi 2</li>');
    md.push('</ul>');
    md.push('<ol>');
    md.push('  <li>Numaralı liste öğesi</li>');
    md.push('</ol>');
    md.push('<b>Kalın metin</b>');
    md.push('<i>İtalik metin</i>');
    md.push('<br>Satır sonu');
    md.push('<hr>Yatay çizgi');
    md.push('```');
    md.push('');
    md.push('#### 3. SEO Optimizasyonu');
    md.push('');
    md.push('- **Anahtar kelime kullanımı:** Doğal ve akıcı şekilde');
    md.push('- **Alt başlıklar:** H2, H3 tag\'leri ile içeriği böl');
    md.push('- **İç linkleme:** İlgili sayfalara referanslar');
    md.push('- **Görsel alt metinleri:** İmg tag\'lerinde alt attribute kullan');
    md.push('- **Meta açıklamalar:** Her bölüm için kısa özetler');
    md.push('');
    md.push('#### 4. Yazım Stili');
    md.push('');
    md.push('- **Dil:** Türkçe, profesyonel ve anlaşılır');
    md.push('- **Ton:** Bilgilendirici, güvenilir ve yardımcı');
    md.push('- **Uzunluk:** Cümleler orta uzunlukta (15-25 kelime)');
    md.push('- **Paragraflar:** Her paragraf 3-5 cümle');
    md.push('- **Noktalama:** Doğru ve tutarlı kullanım');
    md.push('');
    md.push('### ❌ Yazılmaması Gerekenler');
    md.push('');
    md.push('1. **Spesifik Fiyat Bilgileri:**');
    md.push('   - ❌ "Fiyat 500 TL" gibi net rakamlar');
    md.push('   - ✅ "Uygun fiyat seçenekleri", "Esnek ödeme planları" gibi genel ifadeler');
    md.push('');
    md.push('2. **Kesin Tarih/Süre Bilgileri:**');
    md.push('   - ❌ "3 günde teslim edilir" gibi kesin süreler');
    md.push('   - ✅ "Hızlı teslimat seçenekleri", "Ortalama teslimat süreleri" gibi genel ifadeler');
    md.push('');
    md.push('3. **Garanti ve Söz Verme:**');
    md.push('   - ❌ "Kesinlikle garantili", "100% başarı" gibi kesin ifadeler');
    md.push('   - ✅ "Güvenilir hizmet", "Yüksek başarı oranı" gibi genel ifadeler');
    md.push('');
    md.push('4. **Rekabetçi İfadeler:**');
    md.push('   - ❌ "En ucuz", "En hızlı" gibi karşılaştırmalı ifadeler');
    md.push('   - ✅ "Uygun fiyat", "Hızlı hizmet" gibi pozitif ifadeler');
    md.push('');
    md.push('### 📋 Soru-Cevap (FAQ) Bölümü Yazım Kılavuzu');
    md.push('');
    md.push('#### Soru Formatları');
    md.push('');
    md.push('1. **Nasıl Soruları:**');
    md.push('   - "Nasıl yapılır?"');
    md.push('   - "Nasıl çalışır?"');
    md.push('   - "Nasıl başvurulur?"');
    md.push('');
    md.push('2. **Neden Soruları:**');
    md.push('   - "Neden tercih edilmeli?"');
    md.push('   - "Neden önemlidir?"');
    md.push('');
    md.push('3. **Ne Soruları:**');
    md.push('   - "Ne kadar sürer?"');
    md.push('   - "Ne gereklidir?"');
    md.push('   - "Ne içerir?"');
    md.push('');
    md.push('4. **Hangi Soruları:**');
    md.push('   - "Hangi belgeler gerekli?"');
    md.push('   - "Hangi seçenekler mevcut?"');
    md.push('');
    md.push('#### Cevap Yazım Kuralları');
    md.push('');
    md.push('- **Uzunluk:** Her cevap 100-200 harf arası');
    md.push('- **Yapı:** Açıklayıcı, bilgilendirici ve yardımcı');
    md.push('- **Format:** HTML paragraf veya liste formatında');
    md.push('- **İçerik:** Spesifik değil, genel ve bilgilendirici');
    md.push('');
    md.push('#### Örnek FAQ Bölümü');
    md.push('');
    md.push('```html');
    md.push('<h2>Sık Sorulan Sorular</h2>');
    md.push('');
    md.push('<h3>Nasıl başvurabilirim?</h3>');
    md.push('<p>Başvuru süreci oldukça basittir. Online formu doldurarak veya iletişim kanallarımızdan bize ulaşabilirsiniz. Detaylı bilgi için müşteri hizmetlerimizle iletişime geçebilirsiniz.</p>');
    md.push('');
    md.push('<h3>Ne kadar sürer?</h3>');
    md.push('<p>Süreç, seçilen hizmet türüne ve özel gereksinimlere göre değişiklik gösterebilir. Ortalama süreler hakkında detaylı bilgi için teklif alabilirsiniz.</p>');
    md.push('');
    md.push('<h3>Hangi belgeler gereklidir?</h3>');
    md.push('<p>Gerekli belgeler hizmet türüne göre değişiklik gösterir. Genel olarak kimlik belgesi ve ilgili evraklar istenmektedir. Detaylı liste için danışmanlarımızla iletişime geçebilirsiniz.</p>');
    md.push('```');
    md.push('');
    md.push('### 📝 Meta Bilgiler Yazım Kılavuzu');
    md.push('');
    md.push('#### Description (description.tr)');
    md.push('');
    md.push('- **Uzunluk:** 150-180 harf arası');
    md.push('- **İçerik:** Sayfa içeriğinin özeti');
    md.push('- **Stil:** Çekici, öz ve bilgilendirici');
    md.push('- **Anahtar kelime:** Doğal şekilde 1-2 kez kullan');
    md.push('');
    md.push('**Örnek:**');
    md.push('> "İngiltere\'ye ev eşyası taşımacılığı için profesyonel hizmet. Güvenli, hızlı ve sigortalı taşıma çözümleri. Detaylı bilgi ve teklif alın."');
    md.push('');
    md.push('#### Keyword (keyword.tr)');
    md.push('');
    md.push('- **Uzunluk:** Maksimum 180 harf');
    md.push('- **Format:** Virgülle ayrılmış anahtar kelimeler');
    md.push('- **İçerik:** Sayfa ile ilgili 5-10 anahtar kelime');
    md.push('- **Stil:** Doğal ve ilgili kelimeler');
    md.push('');
    md.push('**Örnek:**');
    md.push('> "İngiltere ev eşyası taşımacılığı, uluslararası nakliyat, evden eve taşıma, güvenli taşımacılık, sigortalı taşıma"');
    md.push('');
    md.push('#### Spot (spot.tr)');
    md.push('');
    md.push('- **Uzunluk:** Maksimum 180 harf');
    md.push('- **İçerik:** Sayfanın kısa ve çarpıcı özeti');
    md.push('- **Stil:** Dikkat çekici ve öz');
    md.push('');
    md.push('**Örnek:**');
    md.push('> "İngiltere\'ye ev eşyası taşımacılığında güvenilir çözüm ortağınız. Profesyonel hizmet, sigortalı taşıma."');
    md.push('');
    md.push('### 🌍 Çoklu Dil Çevirisi Kılavuzu');
    md.push('');
    md.push('#### Çeviri Prensipleri');
    md.push('');
    md.push('1. **Doğallık:** Çeviri doğal ve akıcı olmalı');
    md.push('2. **Anlam Korunması:** Orijinal anlam korunmalı');
    md.push('3. **Kültürel Uyum:** Hedef dilin kültürüne uygun');
    md.push('4. **Terminoloji:** Sektörel terimler doğru kullanılmalı');
    md.push('');
    md.push('#### Çeviri Kontrol Listesi');
    md.push('');
    md.push('- [ ] Tüm alanlar çevrildi (name, description, keyword, spot, text)');
    md.push('- [ ] Çeviri doğal ve akıcı');
    md.push('- [ ] Terminoloji doğru kullanıldı');
    md.push('- [ ] HTML formatı korundu');
    md.push('- [ ] Karakter limitleri kontrol edildi');
    md.push('');
    md.push('### 🔍 SEO Kontrol Listesi');
    md.push('');
    md.push('Her sayfa düzenlemesinden sonra kontrol edin:');
    md.push('');
    md.push('- [ ] Text içeriği minimum ' + SEO_CRITERIA.textMinLength + ' harf');
    md.push('- [ ] FAQ bölümü var ve en az 3-5 soru-cevap içeriyor');
    md.push('- [ ] Description maksimum ' + SEO_CRITERIA.descriptionMaxLength + ' harf');
    md.push('- [ ] Keyword maksimum ' + SEO_CRITERIA.keywordMaxLength + ' harf');
    md.push('- [ ] Spot maksimum ' + SEO_CRITERIA.spotMaxLength + ' harf');
    md.push('- [ ] Name maksimum ' + SEO_CRITERIA.nameMaxLength + ' harf');
    md.push('- [ ] Tüm alanlar için İngilizce çeviri var');
    md.push('- [ ] HTML formatı doğru');
    md.push('- [ ] Spesifik fiyat/tarih bilgileri yok');
    md.push('- [ ] İçerik SEO odaklı ve değer katıcı');
    md.push('');
    md.push('---');
    md.push('');
    md.push('## 🚀 Hızlı Başlangıç');
    md.push('');
    md.push('1. **Sayfa seç:** Todo listesinden bir sayfa seç');
    md.push('2. **Dosyayı aç:** `page/[sayfa-id]/index.json`');
    md.push('3. **İçeriği düzenle:** Yukarıdaki yönergelere göre');
    md.push('4. **Kontrol et:** SEO kontrol listesini kullan');
    md.push('5. **Kaydet:** Değişiklikleri kaydet');
    md.push('6. **Güncelle:** Scripti tekrar çalıştırarak todo listesini güncelle');
    md.push('');
    md.push('---');
    md.push('');
    md.push('**Not:** Bu liste otomatik olarak oluşturulmuştur. Düzenlemeler yapıldıkça scripti tekrar çalıştırarak güncelleyebilirsiniz.');
    md.push('');
    
    return md.join('\n');
}
function main() {
    console.log('🚀 SEO Analiz Scripti Başlatılıyor...\n');
    var analysisData = analyzeAllPages();
    console.log('📝 Todo listesi oluşturuluyor...\n');
    var todoList = generateTodoList(analysisData);
    fs.writeFileSync(outputFile, todoList, 'utf8');
    
    console.log('✅ Todo listesi oluşturuldu: ' + outputFile);
    console.log('\n📊 Özet:');
    console.log('   - Toplam sayfa: ' + analysisData.stats.total);
    console.log('   - Sorunlu sayfa: ' + analysisData.stats.withIssues);
    console.log('   - Uyarılı sayfa: ' + analysisData.stats.withWarnings);
    console.log('\n✨ İşlem tamamlandı!\n');
}
main();
