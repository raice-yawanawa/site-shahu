# Publicação (deploy) — passo a passo

Tudo aqui usa **serviços gratuitos**. Os passos marcados com 🖐️ são feitos por você no
navegador (criar contas, autorizar) — não dá para automatizar.

## Passo 0 — Enviar o código para o GitHub

🖐️ Crie uma conta no [GitHub](https://github.com) e um repositório novo (pode ser
privado), por exemplo `site-shahu`. Depois, na pasta do projeto:

```bash
git remote add origin https://github.com/SEU-USUARIO/site-shahu.git
git push -u origin main
```

> O repositório é a **fonte da verdade**: o CMS grava aqui e o deploy é disparado a
> partir daqui.

---

## Passo 1 — Hospedar o site

Escolha **uma** opção. A recomendada é a Cloudflare Pages (endereço na raiz, domínio
próprio grátis, ideal para o CMS).

### Opção A — Cloudflare Pages (recomendada)

1. 🖐️ Crie conta em [Cloudflare](https://dash.cloudflare.com) → **Workers & Pages** →
   **Create** → **Pages** → **Connect to Git** e selecione o repositório.
2. Configure o build:
   - **Framework preset:** `None`
   - **Build command:** `pip install -e . && python scripts/build.py`
   - **Build output directory:** `public`
   - **Environment variables:** adicione `PYTHON_VERSION` = `3.11`
3. **Save and Deploy.** Em ~1 min o site fica no ar em `https://<projeto>.pages.dev`.
4. (Opcional) 🖐️ Em **Custom domains**, conecte um domínio próprio gratuitamente.

> O build da Cloudflare usa o PyPI público, então `pip install -e .` funciona lá
> normalmente. Mantenha `base_url: ""` em `content/site.yaml` (site na raiz).

### Opção B — GitHub Pages (o workflow já está pronto)

O repositório já inclui [`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml),
que testa, faz o build e publica no GitHub Pages.

1. 🖐️ No GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
2. Cada `git push` na `main` publica automaticamente.
3. Ajuste de endereço:
   - **Site de projeto** (`usuario.github.io/site-shahu`): defina
     `base_url: "/site-shahu"` em `content/site.yaml` para os links/imagens
     resolverem no subcaminho.
   - **Site de usuário** (repositório `usuario.github.io`): deixe `base_url: ""`.

---

## Passo 2 — Ativar o painel de conteúdo (CMS)

O painel ([`/admin`](../admin/)) usa o **Sveltia CMS** e autentica via **GitHub**.

1. Em [`admin/config.yml`](../admin/config.yml), preencha `backend.repo` com
   `SEU-USUARIO/site-shahu`.
2. 🖐️ Crie um **GitHub OAuth App** (GitHub → *Settings → Developer settings →
   OAuth Apps → New OAuth App*):
   - **Homepage URL:** endereço do site (ex.: `https://<projeto>.pages.dev`)
   - **Authorization callback URL:** `https://<seu-worker>.workers.dev/callback`
   Guarde o **Client ID** e gere um **Client Secret**.
3. 🖐️ Suba o provedor de OAuth gratuito
   [`sveltia-cms-auth`](https://github.com/sveltia/sveltia-cms-auth) como um
   **Cloudflare Worker** e configure as variáveis `GITHUB_CLIENT_ID` e
   `GITHUB_CLIENT_SECRET`.
4. Em `admin/config.yml`, aponte `backend.base_url` para o endereço do Worker:
   ```yaml
   backend:
     name: github
     repo: SEU-USUARIO/site-shahu
     branch: main
     base_url: https://<seu-worker>.workers.dev
   ```
5. Acesse `https://SEU-SITE/admin/`, entre com o GitHub e comece a cadastrar peças.
   Publicar dispara o rebuild e o site atualiza sozinho.

---

## Passo 3 — Trocar os dados de exemplo pelos reais

Quando estiver pronto (pelo painel ou editando os arquivos):

- **Contato:** `whatsapp` e `instagram` em [`content/site.yaml`](../content/site.yaml).
- **Textos e fotos da home:** demais campos de `home` em `site.yaml` e imagens em
  `assets/images/brand/`.
- **Peças:** adicione arquivos em `content/products/` com fotos em
  `assets/images/products/` (ver [CONTEUDO.md](CONTEUDO.md)).

Cada alteração publicada reconstrói e republica o site automaticamente.
