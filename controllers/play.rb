class PlayController < BaseController

  get '/:game' do
    redirect '/' unless Repos::Games.exists? params[:game]
    erb :app
  end
end
