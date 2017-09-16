require 'rubygems'
require 'bundler'
Bundler.setup

require './config/config'
require './controllers/base'
require './controllers/welcome'
require './controllers/games'
require './controllers/actions'
require './controllers/play'
require './controllers/export'
require './controllers/bots'

# require 'rack-livereload' if ENV['RACK_ENV'] == 'development'
# use Rack::LiveReload, no_swf: true , min_delay: 2000, max_delay: 5000 if ENV['RACK_ENV'] == 'development'
# use Rack::Deflater

require './handling'
use MyExceptionHandling

map '/' do
  run WelcomeController
end

map '/games' do
  run GamesController
end

map '/actions' do
  run ActionsController
end

map '/play' do
  run PlayController
end

map '/export' do
  run ExportController
end

map '/bots' do
  run BotsController
end
