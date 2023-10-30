import React from 'react';
import {
    Grid, AppBar, Toolbar, Typography
} from '@material-ui/core';
import './TopBar.css';
// import fetchModel from "../../lib/fetchModelData";
import axios from 'axios';

/**
 * Define TopBar
 */
class TopBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            view: this.props.view,
            version:""
        };
    }

    componentDidMount = () => {
        axios.get("http://localhost:3000/test/info")
            .then((response) => {
                this.setState({ version: response.data.__v});
                this.props.changeView("Welcome to the photosharing app!");
            })
            .catch((error) => {console.log(error);});
    };

    componentDidUpdate = (prevProps) => {
        if (prevProps.view !== this.props.view) {
            this.setState({ view: this.props.view });
            this.props.changeView(this.props.view);
            //   axios.get("http://localhost:3000/test/info")
            //   .then((response) => {
            //     this.setState({ version: response.data.__v,view: this.props.view });
            //   })
            //   .catch((error) => {console.log(error);});
        }
    };

    render() {
        return (
            <AppBar className="cs142-topbar-appBar" position="absolute">
                <Toolbar>
                    <Grid
                        container
                        direction="row"
                        justify="space-between"
                        alignItems="center"
                    >
                        <Grid item xs>
                            <Typography variant="h5" color="inherit">
                                Yi Hu
                            </Typography>
                        </Grid>
                        <Grid item xs>
                            <Typography variant="h5" color="inherit">
                                Version: {this.state.version}
                            </Typography>
                        </Grid>
                        <Grid item xs>
                            <Typography variant="h5" align="right">
                                {this.state.view}
                            </Typography>
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
        );
    }
}

export default TopBar;