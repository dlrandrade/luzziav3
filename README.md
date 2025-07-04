# LuzzIA PHP Version

Este projeto é uma versão simplificada em **PHP**, **HTML** e **JavaScript** da antiga aplicação React.

## Executando localmente

1. Certifique-se de ter o PHP instalado.
2. Execute o servidor embutido do PHP a partir do diretório do projeto:

```bash
php -S localhost:8000
```

3. Acesse `http://localhost:8000` no navegador.

O chat utiliza um arquivo `api.php` que encaminha as mensagens para a API definida em `config.php`. Por padrão, existe uma implementação simulada (`gemini.php`) e outra de exemplo (`openai.php`). Para trocar ou adicionar APIs, edite `config.php` e crie novos arquivos seguindo o mesmo padrão.

Os agentes e usuários de exemplo ficam definidos em `data.php`. Lá você também encontra a lista `$ICON_OPTIONS` com diversos ícones da biblioteca [Phosphor Icons](https://phosphoricons.com/) para usar ao criar novos agentes.
