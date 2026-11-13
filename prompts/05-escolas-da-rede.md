# 05. Escolas da rede (cadastro, ficha e mapa)

**Ferramenta:** Claude · **Onde virou código:** app `rede` e telas `escolas`, `fichaEscola`, `diesEscolas`, `diesMunicipios`

## Prompt atual (v3)

```
CONTEXTO
SE Educa, app rede. A tela "Escolas da rede" ainda usa dados fictícios e um mapa desenhado.

PEDIDO
- Cadastro da escola com os campos da página da escola no site da SEDUC: CNPJ, código SIGA,
  telefone, e-mail, nº de salas, zona, comodato, endereço completo com CEP.
- Ficha da escola com turmas (série, turma, turno), equipe diretiva, professores e resoluções.
- "Escolas da rede" com os dados reais da API e um mapa de verdade (OpenStreetMap).
- Cadastro dos 75 municípios de Sergipe; a regional (DRE) da escola vem do município.

REGRAS E RESTRIÇÕES
- Latitude e longitude têm que cair dentro de Sergipe.
- Alunos, turmas e servidores só aparecem para a gestão (Secretaria e a própria escola).
- Não mostrar "vagas" nessas telas.

FORMATO DA RESPOSTA
Plano primeiro. Arquivos completos, migrations, testes e o que instalar no front.
```

## Histórico de versões

| Versão | Data | Mudança | Motivo |
|---|---|---|---|
| v1 | 2026-10-29 | Campos da SEDUC e ficha da escola para o DIES. | Refino pedido pelo mentor. |
| v2 | 2026-10-29 | Tela com dados reais e mapa Leaflet + OpenStreetMap; validação de coordenadas em Sergipe. | O mapa ilustrativo não mostrava as escolas cadastradas. |
| v3 | 2026-10-30 | Municípios e DRE; "vagas" removidas dessas telas. | Feedback do mentor. |
