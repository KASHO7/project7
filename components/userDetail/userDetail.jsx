import React from "react";
import { Grid, Typography, Button } from "@material-ui/core";
import "./userDetail.css";
import { Link } from "react-router-dom";
const axios = require('axios').default;

const DETAILS = "Info about ";

/**
 * Define UserDetail
 */
class UserDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: undefined
        };
        this.fetchUserData(props.match.params.userId);
    }

    fetchUserData(userId) {
        axios.get(`/user/${userId}`)
            .then(response => {
                this.setState({ user: response.data });
                this.props.changeView(
                    DETAILS, `${response.data.first_name} ${response.data.last_name}`
                );
            })
            .catch(err => console.log(err.response));
    }

    componentDidUpdate(prevProps) {
        if (prevProps.match.params.userId !== this.props.match.params.userId) {
            this.fetchUserData(this.props.match.params.userId);
        }
    }

    render() {
        return this.state.user ? (
            <Grid container justify="space-evenly" alignItems="center">
                <Grid item xs={6}>
                    <Typography variant="h3">
                        {`${this.state.user.first_name} ${this.state.user.last_name}`}
                    </Typography>
                    <Typography variant="h5">
                        {this.state.user.occupation} <br />
                        based in {this.state.user.location}
                    </Typography>
                    <Typography variant="body1">{this.state.user.description}</Typography>
                </Grid>
                <Grid item xs={4}>
                    <Button variant="contained" size="large">
                        <Link to={`/photos/${this.state.user._id}`}>See photos</Link>
                    </Button>
                </Grid>
            </Grid>
        ) : (
            <div />
        );
    }
}

export default UserDetail;
