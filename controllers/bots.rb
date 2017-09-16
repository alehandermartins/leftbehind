class BotsController < BaseController

  DEFAULT_BOT_URL = 'http://localhost:4000'

  post '/url' do
    scopify game: true

    return success game, url: ENV['BOT_URL'] || DEFAULT_BOT_URL if  Repos::Games.exists? game

    fail! :game_not_found
  end
end
