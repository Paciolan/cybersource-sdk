{ pkgs, ... }: {
  packages = with pkgs; [
    fish
    git
    watchman
  ];

  languages = {
    javascript = {
      enable = true;
      package = pkgs.nodejs_20;
      npm = {
        enable = true;
        install.enable = true;
      };
    };

    java = {
      enable = true;
      jdk.package = pkgs.jdk17;
    };
  };

  enterShell = ''
    fish; exit
  '';
}
