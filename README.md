# Flip Clock Card pentru Home Assistant

Un card animat cu ceas flip modern și elegant pentru Home Assistant.

![Flip Clock Card](https://img.shields.io/badge/version-1.0.0-blue)
![Home Assistant](https://img.shields.io/badge/home%20assistant-compatible-green)

## 📸 Preview

Card-ul oferă o animație flip pentru fiecare cifră, cu suport pentru teme dark/light, format 12/24 ore, și afișare opțională a datei și secundelor.

## ✨ Caracteristici

- 🎨 **Animație flip realistă** - Fiecare cifră se întoarce cu o animație 3D fluidă
- 🔧 **Design mecanic autentic** - Jumătăți separate vizibile ca la flip clock-urile clasice
- 📏 **Complet customizabil** - Configurează dimensiunile cardurilor și fontului
- 🌓 **Teme dark și light** - Alege tema care se potrivește interfeței tale
- ⏰ **Format 12/24 ore** - Suport pentru ambele formate
- 📅 **Afișare dată** - Opțional, afișează data curentă
- ⏱️ **Secundar opțional** - Alege dacă vrei să vezi și secundele
- 🎛️ **Configurabil** - Viteză de animație ajustabilă
- 📱 **Responsive** - Se adaptează pe toate dispozitivele

## 📦 Instalare

### Prin HACS (Recomandat)

1. Deschide HACS în Home Assistant
2. Click pe "Frontend"
3. Click pe cele trei puncte din colțul dreapta sus
4. Selectează "Custom repositories"
5. Adaugă URL-ul acestui repository: `https://github.com/Zuzzica/flip-clock-card`
6. Categoria: `Dashboard`
7. Click pe "Add"
8. Caută "Flip-clock-Card" în HACS
9. Click pe "Download"
10. Restart Home Assistant

### Manual

1. Descarcă fișierul `flip-clock-card.js`
2. Copiază-l în directorul `/config/www/` din Home Assistant
3. Adaugă resursa în Configuration → Lovelace Dashboards → Resources:
   - URL: `/local/flip-clock-card.js`
   - Type: `JavaScript Module`
4. Restart Home Assistant

## 🔧 Configurare

### Configurare Simplă

```yaml
type: custom:flip-clock-card
```

### Configurare Completă

```yaml
type: custom:flip-clock-card
show_seconds: true        # Afișează secundele (default: true)
show_date: true           # Afișează data (default: true)
hour_format: '24'         # Format oră: '12' sau '24' (default: '24')
theme: 'dark'             # Tema: 'dark' sau 'light' (default: 'dark')
animation_speed: 0.6      # Viteza animației în secunde (default: 0.6)
card_width: 80            # Lățime card în px (default: 80)
card_height: 100          # Înălțime card în px (default: 100)
font_size: 72             # Mărime font în px (default: 72)
separator_size: 48        # Mărime separator ":" în px (default: 48)
```

## 🎨 Opțiuni de Configurare

| Opțiune | Tip | Default | Descriere |
|---------|-----|---------|-----------|
| `show_seconds` | boolean | `true` | Afișează sau ascunde secundele |
| `show_date` | boolean | `true` | Afișează sau ascunde data |
| `hour_format` | string | `'24'` | Format oră: `'12'` sau `'24'` |
| `theme` | string | `'dark'` | Tema cardului: `'dark'` sau `'light'` |
| `animation_speed` | number | `0.6` | Viteza animației flip (în secunde) |
| `card_width` | number | `80` | Lățimea fiecărui card (în px) |
| `card_height` | number | `100` | Înălțimea fiecărui card (în px) |
| `font_size` | number | `72` | Mărimea fontului cifrelor (în px) |
| `separator_size` | number | `48` | Mărimea separatorului ":" (în px) |

## 📱 Exemple de Utilizare

### Ceas Minimal (fără secundar și dată)

```yaml
type: custom:flip-clock-card
show_seconds: false
show_date: false
theme: 'light'
```

### Ceas Complet cu Animație Rapidă

```yaml
type: custom:flip-clock-card
show_seconds: true
show_date: true
hour_format: '24'
theme: 'dark'
animation_speed: 0.4
```

### Format 12 Ore cu Temă Light

```yaml
type: custom:flip-clock-card
hour_format: '12'
theme: 'light'
show_seconds: true
```

### Carduri Mari (pentru tabletă pe perete)

```yaml
type: custom:flip-clock-card
card_width: 100
card_height: 130
font_size: 90
separator_size: 64
show_seconds: false
```

### Carduri Mici (compact pentru dashboard)

```yaml
type: custom:flip-clock-card
card_width: 60
card_height: 80
font_size: 56
separator_size: 40
show_date: false
```

## 🎯 Integrare în Dashboard

Poți adăuga cardul în orice dashboard Lovelace:

1. Intră în modul de editare al dashboard-ului
2. Click pe "Add Card"
3. Scroll down și selectează "Custom: Flip Clock Card"
4. Configurează opțiunile dorite
5. Salvează

## 🐛 Troubleshooting

### Cardul nu apare în lista de carduri

- Verifică că resursa este adăugată corect în Resources
- Verifică console-ul browserului pentru erori (F12)
- Asigură-te că ai restartat Home Assistant după instalare

### Animația nu funcționează smooth

- Încearcă să crești `animation_speed` la 0.8 sau 1.0
- Verifică performanța dispozitivului

### Data nu se afișează corect

- Cardul folosește limba setată în Home Assistant
- Verifică setările de limbă din Configuration → General

## 🤝 Contribuții

Contribuțiile sunt binevenite! Simte-te liber să:
- Raportezi bug-uri
- Sugerezi funcționalități noi
- Trimiți pull request-uri

## 📄 Licență

MIT License - vezi fișierul LICENSE pentru detalii

## ⭐ Suport

Dacă îți place acest card, dă-i un ⭐ pe GitHub!

## 🔗 Link-uri Utile

- [Home Assistant Community](https://community.home-assistant.io/)
- [HACS](https://hacs.xyz/)
- [Lovelace UI Documentation](https://www.home-assistant.io/lovelace/)

---

Creat cu ❤️ pentru comunitatea Home Assistant
