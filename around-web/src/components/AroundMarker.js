import React from 'react';
import { Marker, InfoWindow } from 'react-google-maps';

export class AroundMarker extends React.Component {
    state = {
        isOpen: false
    }

    toggleOpen = () => {
        this.setState((prevState) => {
            return {
                isOpen: !prevState.isOpen
            }
        });
    }

    render() {
        const { location, url, user, message } = this.props.post;
        const { lat, lon } = location;

        return (
            <Marker
                position={{ lat, lng: lon }}
                onMouseOver={this.toggleOpen}
                onMouseOut={this.toggleOpen}
            >
                {
                    this.state.isOpen ? (
                        <InfoWindow
                            onCloseClick={this.toggleOpen}
                        >
                            <div>
                                <img
                                    alt={message}
                                    src={url}
                                    className="around-marker-image"
                                />
                                <p>{user}: {message}</p>
                            </div>
                        </InfoWindow>
                    ):null
                }
            </Marker>
        );
    }
}