class GamesController < BaseController

  post '/create' do
    scopify name: :game, player: true, type: true, password: true
    check_names game, player
    check_type_and_password type, password

    success create_for player, game, type, password, player['uuid']
  end

  post '/join' do
    scopify uuid: :game, player: true
    exists? game
    check_player player
    check_full game
    check_started game

    success add_to game, player
  end

  post '/start' do
    scopify uuid: :game, player: true, style: true, lapse: true
    return fail! 'Not enough players' unless Services::Games.ready? game
    current_game = Repos::Games.game game
    current_game[:style] = style
    current_game[:lapse] = lapse
    return fail! 'wrong_host' unless current_game[:host] == player
    Services::Games.start current_game
    success game
  end

  post '/game_status?' do
    scopify uuid: :game
    exists? game
    current_game = Repos::Games.game game
    success game, {game_status: current_game[:status]}
  end

  post '/ready' do
    scopify uuid: :game, player: true
    return fail! 'Not enough players' unless Services::Games.ready? game
    success game
  end

  post '/available' do
    respond_with_json

    available.to_json
  end

  post '/ongoing' do
    scopify player_uuid: :player

    ongoing_for(player).to_json
  end

  post '/team-mates' do
    respond_with_json
    scopify game_uuid: :game, player_uuid: :player

    team_mates(player, game).to_json
  end

  post '/players' do
    respond_with_json
    scopify game_uuid: :game

    players(game).to_json
  end

  get '/join/:uuid' do
    scopify uuid: :game
    redirect '/' unless exists? game

    erb :join
  end

  post '/game-name' do
    scopify game_uuid: :game

    name = Repos::Games.name game
    name.to_json
  end

  post '/get-stats' do
    scopify game_uuid: :game, player_uuid: :player
    exists? game

    stats = Services::Actions.get_stats_for player, game
    success game, {stats: stats}
  end

  private

  def check_player player
    check_invalid_name player['name'], 'invalid_player_name'
  end

  def check_game name
    check_invalid_name name, 'invalid_game_name'
  end

  def check_invalid_name subject, message
    raise LB::Invalid.new message if invalid_name? subject
  end

  def check_names game, player
    check_game game
    check_player player
  end

  def check_type_and_password type, password
    raise LB::Invalid.new 'invalid_type' unless ['public', 'private'].include? type
    check_invalid_name password, 'invalid_password' if type == 'private'
  end

  def exists? game
    raise LB::Invalid::Game unless Repos::Games.exists? game
    true
  end

  def check_started game
    current_game = Repos::Games.game game
    raise LB::Invalid.new 'game_already_started' if current_game[:status] != 'ready'
  end

  def check_full game
    game_is_full = Services::Games.full? game
    raise LB::Invalid.new 'game_full' if game_is_full
  end

  def create_for player, name, type, password, host
    game = Services::Games.create name, type, password, host
    add_to game, player
  end

  def add_to game, player
    type = player['type'] || :human
    Repos::Users.add({ uuid: player['uuid'] }) unless Repos::Users.exists?(player['uuid']) 
    Services::Games.add_player game, player['uuid'], player['name'], type
    game
  end

  def available
    Services::Games.available
  end

  def ongoing_for player
    Services::Games.ongoing(player)
  end

  def team_mates player, game
    players(game).reject { |the_player|
      the_player[:uuid] == player
    }
  end

  def players game
    roles = %i(captain pilot mechanic scientist)
    players = Services::Games.players(game)
    players.sort_by{ |player|
      player['_id'].to_s
    }.zip(roles).map{ |the_player, role|
      {
        name: the_player['name'],
        uuid: the_player['uuid'],
        role: role
      }
    }
  end
end
