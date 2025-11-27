import React from "react";
import { View } from "react-native";

import CustomButton from "../components/CustomButton";
import Insider from "react-native-insider";

function Event() {
  const triggerEvent = () => {
    // --- EVENT --- //
    const arr = ["value1", "value2", "value3"];

    // You can create an event without parameters and call the build method
    Insider.tagEvent("first_event").build();

    // You can create an event then add parameters and call the build method
    Insider.tagEvent("second_event")
      .addParameterWithInt("int_parameter", 10)
      .build();

    // You can create an object and add the parameters later
    let insiderExampleEvent = Insider.tagEvent("third_event");

    insiderExampleEvent
      .addParameterWithString("string_parameter", "This is Insider.")
      .addParameterWithInt("int_parameter", 10)
      .addParameterWithDouble("double_parameter", 10.5)
      .addParameterWithBoolean("bool_parameter", true)
      .addParameterWithDate("date_parameter", new Date());

    // MARK: You can only call the method with array of string otherwise this event will be ignored.
    insiderExampleEvent.addParameterWithArray("array_parameter", arr);

    // Do not forget to call build method once you are done with parameters.
    // Otherwise your event will be ignored.
    insiderExampleEvent.build();

    console.log("Insider events triggered.");
  };

  return (
    <View>
      <CustomButton text="Trigger Events" onPress={triggerEvent} />
    </View>
  );
}

export default Event;
