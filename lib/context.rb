require_relative './context/team'
require_relative './context/players'
require_relative './context/locations'
require_relative './context/items'
require_relative './context/ia'
require_relative './context/slots'
require_relative './context/inventory'
require_relative './context/team_inventory'
require_relative './context/information'
require_relative './context/random_generator'
require_relative './context/winner_selection'
require_relative './context/tie_breakers'
require_relative './context/action_builder'

require_relative './factories/slots'
require_relative './factories/players'

class Context
  def initialize game
    players_hashes = Repos::Players.grab(game)
    actions_from_repo = Repos::Actions.grab(game)

    @random_generator = RandomGenerator.new(game.to_s.delete('-').to_i(16))

    @players = Factories::Players.create(players_hashes)

    @team = Team.new(
      @players,
      WinnerSelection.new(RandomTieBreaker.new(@random_generator))
    )

    @locations = Locations.new(@random_generator)

    @items = Items.new(game)

    @ia = IA.new(@locations, @random_generator)

    @slots = Factories::Slots.create(actions_from_repo, players)
  end

  private :initialize

  def team
    @team
  end

  def players
    @players
  end

  def locations
    @locations
  end

  def items
    @items
  end

  def ia
    @ia
  end

  def slots
    @slots
  end

  def random_generator
    @random_generator
  end

  def to_h
    {
      players: @players.to_h,
      team: @team.to_h,
      slots: @slots.to_h
    }
  end

  class << self
    def build_for game
      new game
    end
  end
end

