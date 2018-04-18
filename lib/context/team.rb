class Team
  attr_reader :inventory, :information, :votes_by_player

  def initialize players, winner_selection
    @players = players
    @inventory = TeamInventory.new
    @winner_selection = winner_selection
  end

  def random_number
    @winner_selection.random_number
  end

  def random_number_up_to max
    @winner_selection.random_number_up_to max
  end

  def winner_selection
    @winner_selection
  end
end
