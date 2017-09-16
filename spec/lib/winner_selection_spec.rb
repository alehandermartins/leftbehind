describe 'WinnerSelection' do
  xdescribe "when there's only one candidate" do
    it 'selects it' do
      team_players = [
        {
          'name' => 'player_name',
          'uuid' => 'player_uuid'
        },
        {
          'name' => 'otter_player_name',
          'uuid' => 'otter_player_uuid'
        },
        {
          'name' => 'anotter_player_name',
          'uuid' => 'anotter_player_uuid'
        }
      ]

      winner_selection = WinnerSelection.new(RandomTieBreaker.new(RandomGenerator))

      winner_selection.winner_from()

      expect(tie_breaker.untie(possible_winners)).to eq(the_winner)
    end


  end

  # it 'when thereselects the only candidate' do
  #   the_randomly_chosen_index = 0
  #   possible_winners = []
  #   the_winner = 'the_winners uuid'
  #   possible_winners[the_randomly_chosen_index] = the_winner
  #   possible_winners[1] = 'the loosers uuid'
  #   allow(random_generator).to receive(:random_index_up_to).and_return(the_randomly_chosen_index)
  #   tie_breaker = RandomTieBreaker.new(random_generator)

  #   expect(tie_breaker.untie(possible_winners)).to eq(the_winner)
  # end
end
