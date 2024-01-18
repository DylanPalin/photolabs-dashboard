import React, { Component } from "react";
import Loading from "./Loading";
import classnames from "classnames";
import Panel from "./Panel";
import { getTotalPhotos, getTotalTopics, getUserWithMostUploads, getUserWithLeastUploads } from "helpers/selectors";

const data = [
  {
    id: 1,
    label: "Total Photos",
    getValue: getTotalPhotos
  },
  {
    id: 2,
    label: "Total Topics",
    getValue: getTotalTopics
  },
  {
    id: 3,
    label: "User with the most uploads",
    getValue: getUserWithMostUploads
  },
  {
    id: 4,
    label: "User with the least uploads",
    getValue: getUserWithLeastUploads
  },
];

// The Dashboard component is a class component that has a state with two properties: loading and focused.
class Dashboard extends Component {
  state = {
    loading: true,
    focused: null,
    photos: [],
    topics: [],
  };

  componentDidMount() {
    const focused = JSON.parse(localStorage.getItem("focused"));
    const urlsPromise = ["/api/photos", "/api/topics"].map((url) =>
      fetch(url).then((response) => response.json())
    );

    if (focused) {
      this.setState({ focused });
    }

    Promise.all(urlsPromise).then(([photos, topics]) => {
      this.setState({
        loading: false,
        photos: photos,
        topics: topics,
      });
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.focused !== this.state.focused) {
      localStorage.setItem("focused", JSON.stringify(this.state.focused));
    }
  }

  // The loading property is set to false and the focused property is set to null.
  selectPanel(id) {
    this.setState((prev) => ({
      focused: prev.focused !== null ? null : id,
    }));
  }

  render() {
    const dashboardClasses = classnames("dashboard", {
      "dashboard--focused": this.state.focused,
    });

    if (this.state.loading) {
      return <Loading />;
    }

    // If the loading property in state is true, the Loading component is rendered.
    const panels = (
      this.state.focused
        ? data.filter((panel) => this.state.focused === panel.id)
        : data
    ).map((panel) => (
      <Panel
        key={panel.id}
        label={panel.label}
        value={panel.getValue(this.state)}
        onSelect={() => this.selectPanel(panel.id)}
      />
    ));

    // The panels variable is set to a ternary operator that checks if the focused property in state is true.
    return <main className={dashboardClasses}>{panels}</main>;
  }
}

export default Dashboard;
