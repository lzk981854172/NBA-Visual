import React from 'react';
import { GoogleMap, withScriptjs, withGoogleMap } from 'react-google-maps';
import { POS_KEY } from '../constants';
import { AroundMarker } from './AroundMarker';

/*
 * Fire API after map is updated (i.e. dragging, zooming)  (o)
 * 1. Center of the map  (o)
 * 2. Radius of lookup
 *
 __ __ __ __
|           |
|           |
|           |
|__ __ __ __|

* center (o)
* corner coordinates

 */

class NormalAroundMap extends React.Component {

    reloadMarkers = () => {
        const center = this.getCenter();
        const radius = this.getRadius();

        this.props.loadNearbyPosts(center, radius);
        // console.log(center, radius);
    }

    getCenter = () => {
        const center = this.map.getCenter();

        return {
            lat: center.lat(),
            lon: center.lng()
        }
    }

    getRadius = () => {
        const center = this.map.getCenter();
        const bounds = this.map.getBounds();

        if (center && bounds) {
            const ne = bounds.getNorthEast();
            const right = new window.google.maps.LatLng(center.lat(), ne.lng());

            return 0.001 * window.google.maps.geometry.spherical.computeDistanceBetween(center, right);
        }
    }

    getMapRef = (mapInstance) => {
        this.map = mapInstance;
    }

    render() {
        const { lat, lon } = JSON.parse(localStorage.getItem(POS_KEY));

        return (
            <GoogleMap
                ref={this.getMapRef}
                defaultZoom={11}
                defaultCenter={{ lat, lng: lon }}
                onDragEnd={this.reloadMarkers}
                onZoomChanged={this.reloadMarkers}
            >
                {
                    this.props.posts.map(post =>
                        <AroundMarker
                            key={post.url}
                            post={post}
                        />
                    )
                }

            </GoogleMap>
        );
    }
}

export const AroundMap = withScriptjs(withGoogleMap(NormalAroundMap));