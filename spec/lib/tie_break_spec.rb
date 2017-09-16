describe 'RandomTieBreaker' do
  let(:random_generator){ double 'RandomGenerator'}

  it 'unties by choosing from the possible winners the one with a randomly selected index' do
    the_randomly_chosen_index = 0
    possible_winners = []
    the_winner = 'the_winners uuid'
    possible_winners[the_randomly_chosen_index] = the_winner
    possible_winners[1] = 'the loosers uuid'
    allow(random_generator).to receive(:random_index_up_to).and_return(the_randomly_chosen_index)
    tie_breaker = RandomTieBreaker.new(random_generator)

    expect(tie_breaker.untie(possible_winners)).to eq(the_winner)
  end
end
