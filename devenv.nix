{ pkgs, lib, config, inputs, ... }:

{
  dotenv.enable = true;

  env.GREET = "weathership";

  packages = with pkgs; [
    git gh just jq ripgrep
    mdbook mdbook-d2 mdbook-mermaid d2 graphviz
    cloudflared
    librsvg
    optipng
  ];

  languages.python = {
    enable = true;
    version = "3.12";
    uv.enable = true;
  };

  languages.javascript = {
    enable = true;
    package = pkgs.nodejs_22;
    pnpm.enable = true;
  };

  languages.typescript.enable = true;

  scripts.hello.exec = ''
    echo "weathership.org dev shell — try: just --list"
  '';

  enterShell = ''
    hello
  '';

  enterTest = ''
    echo "Running tests"
    just docs-build
    just behave-smoke
  '';
}
