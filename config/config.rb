require 'sinatra/config_file'
require 'sinatra/asset_pipeline'
require 'mongo'

require_relative '../exceptions'

require_relative '../repos/games'
require_relative '../repos/players'
require_relative '../repos/actions'
require_relative '../repos/actions_in_memory'

require_relative '../services/games'
require_relative '../services/actions'
require_relative '../services/status'

require_relative '../lib/context'

require_relative '../lib/default/actions'


class BaseController < Sinatra::Base
  set :environment, (ENV['RACK_ENV'].to_sym || :production) rescue :production

  register Sinatra::ConfigFile

  config_file File.join(File.dirname(__FILE__) , 'config.yml')

  set root: File.join(File.dirname(__FILE__), '..')

  set :assets_precompile, %w(
    vendor.css
    vendor.js
    ours.css
    ours.js
    jquery.js
    wait.svg
    cabinsketch_regular.ttf
    cabinsketch_bold.ttf
    glyphicons-halflings-regular.eot
    glyphicons-halflings-regular.svg
    glyphicons-halflings-regular.ttf
    glyphicons-halflings-regular.woff
    og.png
    icon.png
    roles/captain.png
    roles/pilot.png
    roles/mechanic.png
    roles/scientist.png
    map/alien.jpg
    map/alienkill.jpg
    map/bridge.jpg
    map/cabins.jpg
    map/enfermery.jpg
    map/engine.jpg
    map/escape.jpg
    map/life_support.jpg
    map/locked.jpg
    map/warehouse.jpg
    map/weapons_bay.jpg
    custom/*
  )

  set :assets_prefix, %w(assets vendor/assets)
  set :assets_css_compressor, :sass
  set :assets_js_compressor, :uglifier

  register Sinatra::AssetPipeline

  configure do
    enable :sessions
  end

  configure :development, :test do
    puts 'configured for dt'
    Sprockets::Helpers.configure do |config|
      config.debug = true
    end
  end

  # :nocov:
  configure :production, :deployment do
    puts 'configured for pdd'
  end
  # :nocov:

  configure do |x|
    Mongo::Logger.logger.level = ::Logger::FATAL

    DB = Mongo::Client.new settings.mongo_uri
    @@db = DB.database
  end

  configure do
    Repos::Games.for @@db
    Repos::Players.for @@db
    Repos::Actions.for @@db
  end

  configure do
    set :dump_errors, false
    set :raise_errors, true
    set :show_exceptions, false
  end

  helpers do
    def emojione_tags
      return [
        javascript_tag("https://cdn.jsdelivr.net/emojione/2.2.6/lib/js/emojione.min.js"),
        stylesheet_tag("https://cdn.jsdelivr.net/emojione/2.2.6/assets/css/emojione.min.css")
      ].join "\n" if !ENV['EMOJIONE_CDN_PREFIX']

      emojione_cdn_prefix = ENV['EMOJIONE_CDN_PREFIX']
      set_image_path_png = %Q(
        <script type='text/javascript'>
          emojione.imagePathPNG = '#{emojione_cdn_prefix}/assets/png/';
        </script>
      )

      [
        javascript_tag("#{emojione_cdn_prefix}/lib/js/emojione.min.js"),
        stylesheet_tag("#{emojione_cdn_prefix}/assets/css/emojione.min.css"),
        set_image_path_png
      ].join "\n"
    end
  end
end
