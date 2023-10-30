import React from 'react';
import {
    Divider,
    List,
    ListItem,
    ListItemText,
}
    from '@material-ui/core';
import { Link } from "react-router-dom";
import './userList.css';
//import fetchModel from "../../lib/fetchModelData";
import axios from 'axios';

/**
 * Define UserList,
 */
class UserList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            users: undefined
        };
    }

    componentDidMount = () => {
        axios.get("http://localhost:3000/user/list")
            .then((response) => {
                this.setState({users: response.data});
                //this.props.changeView("Users List");
            })
            .catch((error) => {console.error(error);});
    };

    componentDidUpdate = (prevProps) => {
        if (prevProps.view !== this.props.view) {
            // this.setState({view:"User List"});
            this.props.changeView("Users List");
        }
    };

    render() {
        return this.state.users ? (
            <div>
                <List component="nav">
                    {this.state.users.map((user) => {
                        return (
                            <Link to={`/users/${user._id}`} key={user._id}>
                                <ListItem>
                                    <ListItemText primary={`${user.first_name} ${user.last_name}`} />
                                </ListItem>
                                <Divider />
                            </Link>
                        );
                    })}
                </List>
            </div>
        ) : <div/>;
    }
}

export default UserList;