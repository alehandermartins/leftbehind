class RandomGenerator

  def initialize seed = 0
    @rng = Random.new(seed)
  end

  def rand max = nil
    return random_index_up_to max unless max.nil?
    random_number
  end

  def random_number
    @rng.rand
  end

  def random_index_up_to number
    @rng.rand(number)
  end
end
