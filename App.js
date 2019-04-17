import React, { Fragment } from "react";
import {
  Picker,
  StatusBar,
  Text,
  TouchableOpacity,
  View
} from "react-native";

import { styles } from './App.style';
import { getRemaining, createArray } from './utils';


const AVAILABLE_MINUTES = createArray(10);
const AVAILABLE_SECONDS = createArray(60);

export default class App extends React.Component {
  state = {
    remainingSeconds: 0,
    isRunning: false,
    selectedMinutes: "0",
    selectedSeconds: "0"
  };

  interval = null;

  componentDidUpdate(prevProp, prevState) {
    (this.state.remainingSeconds === 0 && prevState.remainingSeconds !== 0) &&
      this.stop();
  }

  componentWillUnmount() {
    this.interval &&
      clearInterval(this.interval);
  }

  start = () => {
    this.setState(state => ({
      remainingSeconds:
        parseInt(state.selectedMinutes, 10) * 60 +
        parseInt(state.selectedSeconds, 10),
      isRunning: true
    }));

    this.interval = setInterval(() => {
      this.setState(state => ({
        remainingSeconds: state.remainingSeconds - 1
      }));
    }, 1000);
  };

  stop = () => {
    clearInterval(this.interval);
    this.interval = null;
    this.setState({
      remainingSeconds: 0,
      isRunning: false
    });
  };

  renderPickers = () => (
    <View style={styles.pickerContainer}>
      <Picker
        style={styles.picker}
        itemStyle={styles.pickerItem}
        selectedValue={this.state.selectedMinutes}
        onValueChange={itemValue => {
          this.setState({ selectedMinutes: itemValue });
        }}
        mode="dropdown"
      >
        {AVAILABLE_MINUTES.map(value => (
          <Picker.Item key={value} label={value} value={value} />
        ))}
      </Picker>
      <Text style={styles.pickerItem}>minutes</Text>
      <Picker
        style={styles.picker}
        itemStyle={styles.pickerItem}
        selectedValue={this.state.selectedSeconds}
        onValueChange={itemValue => {
          this.setState({ selectedSeconds: itemValue });
        }}
        mode="dropdown"
      >
        {AVAILABLE_SECONDS.map(value => (
          <Picker.Item key={value} label={value} value={value} />
        ))}
      </Picker>
      <Text style={styles.pickerItem}>seconds</Text>
    </View>
  );

  render() {
    const { minutes, seconds } = getRemaining(this.state.remainingSeconds);
    const { isRunning } = this.state;
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        {isRunning ?
          <Fragment>
            <Text style={styles.timerText}>{`${minutes}:${seconds}`}</Text>
            <TouchableOpacity
              onPress={this.stop}
              style={[styles.button, styles.buttonStop]}
            >
              <Text style={[styles.buttonText, styles.buttonTextStop]}>Stop</Text>
            </TouchableOpacity>
          </Fragment>
          :
          <Fragment>
            {this.renderPickers()}
            <TouchableOpacity onPress={this.start} style={styles.button}>
              <Text style={styles.buttonText}>Start</Text>
            </TouchableOpacity>
          </Fragment>
        }
      </View>
    );
  }
}