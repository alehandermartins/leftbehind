class ExportController < BaseController

  get '/:game' do
    respond_with_json
    game = params[:game]

    {
      # game:{
      #   uuid: game,
      #   name: Repos::Games.name(game)
      # },
      # players: Repos::Players.grab(game),
      log: Services::Actions.current_context_for(game).to_h

    }.to_json

  end
end
