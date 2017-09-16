class TieBreaker
  def untie candidates
    raise 'TieBreaker untie method should be overriden'
  end
end

class RandomTieBreaker < TieBreaker
  def initialize random_generator
    @random_generator = random_generator
  end

  def random_number
    @random_generator.random_number
  end

  def random_number_up_to max
    @random_generator.random_index_up_to(max)
  end

  def untie candidates
    candidates[@random_generator.random_index_up_to(candidates.size)]
  end
end
