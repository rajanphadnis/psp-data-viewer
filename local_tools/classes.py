class SensorMapping:
    def __init__(self, id: int, name: str, slope: float, offset: float, nickname: str):
        """
        Initialize a SensorMapping instance.

        :param id: Unique identifier for the sensor (int).
        :param name: Name of the sensor (string).
        :param slope: Slope for the sensor mapping (float).
        :param offset: Offset for the sensor mapping (float).
        """
        self.id = id
        self.name = name
        self.slope = slope
        self.offset = offset
        self.nickname = nickname

    def __repr__(self):
        """
        Return a string representation of the SensorMapping instance.
        """
        return (f"SensorMapping(id={self.id} ({self.nickname}), name='{self.name}', "
                f"slope={self.slope}, offset={self.offset})")

    def apply_mapping(self, raw_value: float) -> float:
        """
        Apply the mapping to a raw sensor value.

        :param raw_value: The raw input value to transform (float).
        :return: Transformed value (float).
        """
        return self.slope * raw_value + self.offset
