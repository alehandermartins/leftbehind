class Information
  attr_reader :information

  def initialize
    @information = {}
  end

  def [] key
    information[key]
  end

  def has_key? what
    information.has_key? what
  end

  def add_to subject, topic, info
    information[subject] ||= {}
    information[subject][topic] = info
  end

  def to_h
    information.to_h
  end
end
