class Player

  def initialize uuid, name, role, information
    @uuid = uuid
    @name = name
    @role = role
    @information = information
    @inventory = Inventory.new
    @status = :alive
    @events = []
    @traits = []
    @fix = 6
  end

  def uuid
    @uuid
  end

  def name
    @name
  end

  def role
    @role
  end

  def inventory
    @inventory
  end

  def information
    @information
  end

  def information_for players
    @information.for players
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
    @information.add_trait uuid, trait
  end

  def status
    @status
  end

  def set_status new_status
    @status = new_status
  end

  def alive?
    @status == :alive
  end

  def condition
    return :dead unless alive? || escaped?
    return :ok unless @traits.include?(:c3po) || @traits.include?(:terminator)
    return :ok if @fix == 0
    :broken
  end

  def fix amount = 1
    @fix -= amount if condition == :broken
  end

  def fix_left
    @fix
  end

  def calculate_fix
    goodType = @traits.include?(:c3po)
    return ((4 - @fix) * 100 / 4).ceil if goodType
    ((6 - @fix) * 100 / 6).ceil
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

  def disconnect
    @status = :disconnected
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
