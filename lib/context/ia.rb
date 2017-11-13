class IA
  def initialize locations
    @locations = locations
    @location
    @mark_count = 1
    @locations.lock '8'
    @locations.mark_random @mark_count
  end

  def activate
    @locations.unmark_all
    @location = @locations.mark_random @mark_count
    @locations.lock_random
    @mark_count += 1 if @mark_count < 3
  end

  def location
    @location
  end
end
