class IA
  def initialize locations
    @locations = locations
    @mark_count = 1
    @locations.mark_random @mark_count
  end

  def activate
    @mark_count += 1 if @mark_count < 3
    @locations.unmark_all
    @locations.mark_random @mark_count
  end
end
