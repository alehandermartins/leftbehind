class Player

  def initialize uuid, name
    @uuid = uuid
    @name = name
    @inventory = Inventory.new
    @information = Information.new
    @status = :alive
    @tomb = {}
    @events = []
    @traits = []
    @fix = 4
  end

  def inventory
    @inventory
  end

  def information
    @information
  end

  def events
    @events
  end

  def add_event event
    @events.push event
  end

  def traits
    @traits
  end

  def add_trait trait
    @traits.push trait
  end

  def uuid
    @uuid
  end

  def name
    @name
  end

  def status
    @status
  end

  def alive?
    @status == :alive
  end

  def tomb
    @tomb
  end

  def condition
    return :ok unless @traits.include?(:c3po) || @traits.include?(:terminator)
    return :ok if @fix == 0
    :broken
  end

  def fix
    @fix -= 1 if condition == :broken
  end

  def kill
    @status = :dead
  end

  def crash
    @status = :crashed
  end

  def ia_kill
    @status = :killed
  end

  def escape
    @status = :escaped
  end

  def trap
    @status = :trapped
  end

  def radiate
    @status = :radiated
  end

  def explode
    @status = :exploded
  end

  def escaped?
    @status == :escaped
  end

  def trapped?
    @status == :trapped
  end

  def to_h
    {
      uuid: uuid,
      name: name,
      status: status,
      inventory: inventory.to_h
    }
  end

  def action_at slot
    actions.select{ |the_action| the_action.slot == slot}.first
  end
end
