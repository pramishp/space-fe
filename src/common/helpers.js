import {Box3, BufferAttribute,
    BufferGeometry, LineBasicMaterial,
    LineSegments, Line, Mesh, MeshBasicMaterial, Float32BufferAttribute
} from "three";

const _box = /*@__PURE__*/ new Box3();

class BoxHelper extends LineSegments {

    constructor( object, color = 0xffff00 ) {

        const indices = new Uint16Array( [ 0, 1, 1, 2, 2, 3, 3, 0, 4, 5, 5, 6, 6, 7, 7, 4, 0, 4, 1, 5, 2, 6, 3, 7 ] );
        const positions = new Float32Array( 8 * 3 );

        const geometry = new BufferGeometry();
        geometry.setIndex( new BufferAttribute( indices, 1 ) );
        geometry.setAttribute( 'position', new BufferAttribute( positions, 3 ) );

        super( geometry, new LineBasicMaterial( { color: color, toneMapped: false } ) );

        this.object = object;
        this.type = 'BoxHelper';

        this.matrixAutoUpdate = false;

        this.update();

    }

    update( object ) {

        if ( object !== undefined ) {

            console.warn( 'THREE.BoxHelper: .update() has no longer arguments.' );

        }

        if ( this.object !== undefined ) {

            _box.setFromObject( this.object );

        }

        if ( _box.isEmpty() ) return;

        const min = _box.min.multiplyScalar(1.01)
        const max = _box.max.multiplyScalar(1.01)

        /*
            5____4
        1/___0/|
        | 6__|_7
        2/___3/

        0: max.x, max.y, max.z
        1: min.x, max.y, max.z
        2: min.x, min.y, max.z
        3: max.x, min.y, max.z
        4: max.x, max.y, min.z
        5: min.x, max.y, min.z
        6: min.x, min.y, min.z
        7: max.x, min.y, min.z
        */

        const position = this.geometry.attributes.position;
        const array = position.array;

        array[ 0 ] = max.x; array[ 1 ] = max.y; array[ 2 ] = max.z;
        array[ 3 ] = min.x; array[ 4 ] = max.y; array[ 5 ] = max.z;
        array[ 6 ] = min.x; array[ 7 ] = min.y; array[ 8 ] = max.z;
        array[ 9 ] = max.x; array[ 10 ] = min.y; array[ 11 ] = max.z;
        array[ 12 ] = max.x; array[ 13 ] = max.y; array[ 14 ] = min.z;
        array[ 15 ] = min.x; array[ 16 ] = max.y; array[ 17 ] = min.z;
        array[ 18 ] = min.x; array[ 19 ] = min.y; array[ 20 ] = min.z;
        array[ 21 ] = max.x; array[ 22 ] = min.y; array[ 23 ] = min.z;

        position.needsUpdate = true;

        this.geometry.computeBoundingSphere();

    }

    setFromObject( object ) {

        this.object = object;
        this.update();

        return this;

    }

    copy( source, recursive ) {

        super.copy( source, recursive );

        this.object = source.object;

        return this;

    }

    dispose() {

        this.geometry.dispose();
        this.material.dispose();

    }

}

class PlaneHelper extends Line {

    constructor( plane, size = 1, hex = 0xffff00 ) {

        const color = hex;

        const positions = [ 1, - 1, 0, - 1, 1, 0, - 1, - 1, 0, 1, 1, 0, - 1, 1, 0, - 1, - 1, 0, 1, - 1, 0, 1, 1, 0 ];

        const geometry = new BufferGeometry();
        geometry.setAttribute( 'position', new Float32BufferAttribute( positions, 3 ) );
        geometry.computeBoundingSphere();

        super( geometry, new LineBasicMaterial( { color: color, toneMapped: false } ) );

        this.type = 'PlaneHelper';

        this.plane = plane;

        this.size = size;

        const positions2 = [ 1, 1, 0, - 1, 1, 0, - 1, - 1, 0, 1, 1, 0, - 1, - 1, 0, 1, - 1, 0 ];

        const geometry2 = new BufferGeometry();
        geometry2.setAttribute( 'position', new Float32BufferAttribute( positions2, 3 ) );
        geometry2.computeBoundingSphere();

        this.add( new Mesh( geometry2, new MeshBasicMaterial( { color: color, opacity: 0.2, transparent: true, depthWrite: false, toneMapped: false } ) ) );

    }

    updateMatrixWorld( force ) {

        this.position.set( 0, 0, 0 );

        this.scale.set( 0.5 * this.size, 0.5 * this.size, 1 );

        this.lookAt( this.plane.normal );

        this.translateZ( - this.plane.constant );

        super.updateMatrixWorld( force );

    }

    dispose() {

        this.geometry.dispose();
        this.material.dispose();
        this.children[ 0 ].geometry.dispose();
        this.children[ 0 ].material.dispose();

    }

}

class LineHelper extends Line {

    constructor( object, color = 0xffff00) {

        const indices = new Uint16Array( [ 0, 1, 1, 2, 2, 3, 3, 0, 4, 5, 5, 6, 6, 7, 7, 4, 0, 4, 1, 5, 2, 6, 3, 7 ] );
        const positions = new Float32Array( 8 * 3 );

        const geometry = new BufferGeometry();
        geometry.setIndex( new BufferAttribute( indices, 1 ) );
        geometry.setAttribute( 'position', new BufferAttribute( positions, 3 ) );

        super( geometry, new LineBasicMaterial( { color: color, toneMapped: false, linewidth:20 } ) );

        this.object = object;

        this.type = 'BoxHelper';

        this.matrixAutoUpdate = false;

        this.update();

    }

    update( object ) {

        if ( object !== undefined ) {

            console.warn( 'THREE.BoxHelper: .update() has no longer arguments.' );

        }

        if ( this.object !== undefined ) {

            _box.setFromObject( this.object );

        }

        if ( _box.isEmpty() ) return;

        const min = _box.min.multiplyScalar(1.01)
        const max = _box.max.multiplyScalar(1.01)

        /*
            5____4
        1/___0/|
        | 6__|_7
        2/___3/

        0: max.x, max.y, max.z
        1: min.x, max.y, max.z
        2: min.x, min.y, max.z
        3: max.x, min.y, max.z
        4: max.x, max.y, min.z
        5: min.x, max.y, min.z
        6: min.x, min.y, min.z
        7: max.x, min.y, min.z
        */

        const position = this.geometry.attributes.position;
        const array = position.array;

        array[ 0 ] = max.x; array[ 1 ] = max.y; array[ 2 ] = max.z;
        array[ 3 ] = min.x; array[ 4 ] = max.y; array[ 5 ] = max.z;
        array[ 6 ] = min.x; array[ 7 ] = min.y; array[ 8 ] = max.z;
        array[ 9 ] = max.x; array[ 10 ] = min.y; array[ 11 ] = max.z;
        array[ 12 ] = max.x; array[ 13 ] = max.y; array[ 14 ] = min.z;
        array[ 15 ] = min.x; array[ 16 ] = max.y; array[ 17 ] = min.z;
        array[ 18 ] = min.x; array[ 19 ] = min.y; array[ 20 ] = min.z;
        array[ 21 ] = max.x; array[ 22 ] = min.y; array[ 23 ] = min.z;

        position.needsUpdate = true;

        this.geometry.computeBoundingSphere();

        // this.clickObject.position = this.position;


    }

    setFromObject( object ) {

        this.object = object;
        this.update();

        return this;

    }

    copy( source, recursive ) {

        super.copy( source, recursive );

        this.object = source.object;

        return this;

    }

    dispose() {

        this.geometry.dispose();
        this.material.dispose();

    }

}

export { PlaneHelper };
export {LineHelper};
export {BoxHelper}