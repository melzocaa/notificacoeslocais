# 🍣 JapaSushi Delivery

Um aplicativo mobile desenvolvido para facilitar a experiência de pedidos de comida japonesa, oferecendo praticidade e uma navegação simples e intuitiva.

## 📱 Sobre o projeto

O **JapaSushi Delivery** é um aplicativo de delivery de comida japonesa, desenvolvido com foco em proporcionar uma experiência prática para os usuários. O projeto utiliza tecnologias modernas para integrar funcionalidades nativas de smartphones a uma aplicação desenvolvida com React.

## ✨ Funcionalidades

- Interface mobile desenvolvida com React.
- Integração com recursos nativos do dispositivo.
- Geolocalização utilizando GPS.
- Sistema de notificações locais.
- Aplicativo preparado para execução em dispositivos Android.

## 🛠️ Tecnologias utilizadas

- **React:** desenvolvimento da interface.
- **Vite:** ferramentas de desenvolvimento e build.
- **JavaScript / JSX:** estrutura e lógica da aplicação.
- **Capacitor:** integração com recursos nativos do Android.
- **Geolocation:** acesso à localização do dispositivo.
- **Local Notifications:** gerenciamento de notificações locais.
- **GitHub Actions:** automação do processo de build do APK.

## 📂 Estrutura do projeto

```text
15/
├── .github/
│   └── workflows/
│       └── build-apk.yml
├── android/
├── www/
├── capacitor.config.json
├── vite.config.js
└── package.json
```

## ⚙️ Como executar o projeto

Clone o repositório:

```bash
git clone URL_DO_REPOSITORIO
```

Entre na pasta:

```bash
cd 15
```

Instale as dependências:

```bash
npm install
```

Execute o ambiente de desenvolvimento:

```bash
npm run dev
```

Gere a versão de produção:

```bash
npm run build
```

Sincronize com o Android:

```bash
npx cap sync android
```

## 📦 Geração do APK

O projeto utiliza **GitHub Actions** para automatizar o processo de compilação do aplicativo Android.

Por meio do workflow configurado em `.github/workflows/build-apk.yml`, é possível executar o processo de build e disponibilizar o APK como artefato para download, sem precisar realizar manualmente a compilação pelo Android Studio.

## 🎯 Objetivo

O projeto tem como objetivo aplicar conhecimentos de desenvolvimento mobile, integração de tecnologias web com recursos nativos e automação de processos utilizando ferramentas modernas.

<img width="1080" height="1045" alt="PRINTNOT" src="https://github.com/user-attachments/assets/5c87fe01-9583-44ec-8b68-a711f1f52336" />


---

**JapaSushi Delivery** 🍣

Projeto de desenvolvimento mobile.
