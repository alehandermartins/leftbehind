class WinnerSelection
  def initialize tie_breaker
    @tie_breaker = tie_breaker
  end

  def random_number
    @tie_breaker.random_number
  end

  def random_number_up_to max
    @tie_breaker.random_number_up_to max
  end

  def winner_from candidates
    get_winner_from(possible_winners_in(candidates))
  end

  private
  def possible_winners_in candidates
    max = candidates.values.max
    Hash(candidates.select { |k, v| v == max}).keys
  end

  def get_winner_from possible_winners
    if possible_winners.size == 1
      possible_winners[0]
    end

    @tie_breaker.untie possible_winners
  end
end
