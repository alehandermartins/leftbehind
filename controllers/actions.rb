class ActionsController < BaseController

  post '/send-selected' do
    scopify actions: true, game_uuid: :game, player_uuid: :player
    #fail! "not_enough_selected" unless Services::Actions.actions_validation actions, game, player

    Services::Actions.save_actions game, player, actions
    success game, {player: player}
  end

  def active_page?(path)
  	request.path_info == path
	end
end
