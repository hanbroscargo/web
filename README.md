# Proje Yönergeleri

> Bu dosya projenin çalışma kurallarını, yapısını ve geliştirme notlarını içerir.
> Agent her istekte bu dosyayı okur ve cevabından sonra gerekli güncellemeleri yapar.

## Proje Bilgileri
- Dizin: D:\matrix\public\data\proje\hanbroscargo\web
- Oluşturma: 2026-04-08

## Sayfa Yapısı
<!-- Projedeki sayfalar ve açıklamaları buraya yazılacak -->

## Modül Yapısı
- `module/go1ilz/` - Ürün katalog ve sepet yönetimi modülü
  - Ürün kategorileri ve detayları
  - Arama ve filtreleme işlevselliği
  - Sepet yönetimi (adet, hacim, ağırlık hesaplamaları)
  - PDF raporlama sistemi
  - Teklif alma formu
  - LocalStorage ile kullanıcı verilerinin kalıcı saklanması

## Çalışma Kuralları
<!-- Kodlama stili, dosya düzeni, kullanılan teknolojiler -->

- Modüller genellikle `module/` dizini altında bulunur
- Her modül kendi HTML, CSS ve JavaScript dosyalarını içerir
- Modüller localStorage kullanarak kullanıcı verilerini saklar
- Modüller HTML5, CSS3 ve ES6 JavaScript özellikleri kullanır
- `go1ilz` modülü: Ürün katalog ve sepet yönetimi sistemi
  - Kullanıcılar ürün kategorilerine göre gezer
  - Ürünleri sepete ekleyip çıkarabilir
  - Toplam hacim ve ağırlık hesaplamaları yapar
  - PDF çıktısı alınabilir
  - Teklif isteği gönderilebilir

## Geliştirme Notları
<!-- Yapılan değişiklikler, kararlar, bilinen sorunlar -->

- 2026-04-08: `go1ilz` modülü eklendi - Ürün katalog ve sepet yönetimi sistemi
