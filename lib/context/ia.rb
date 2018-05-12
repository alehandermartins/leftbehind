class IA
  def initialize locations
    @locations = locations
    @deployed = false
    @mark_count = 1
  end

  def deploy
    @deployed = true
  end

  def activate
    return unless @deployed
    @locations.unmark_all
    @locations.mark_random @mark_count
    @mark_count += 1 if @mark_count < 3
  end
end
