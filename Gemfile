source "https://rubygems.org"
# To upgrade, run `bundle update github-pages`.
gem "github-pages", group: :jekyll_plugins

# Bundle the tzinfo-data gem and associated library for Windows and JRuby.
install_if -> { RUBY_PLATFORM =~ %r!mingw|mswin|java! } do
  gem "tzinfo", "~> 1.2"
  gem "tzinfo-data"
end

# Performance-booster for watching directories on Windows
gem "wdm", "~> 0.1.1", :install_if => Gem.win_platform?
