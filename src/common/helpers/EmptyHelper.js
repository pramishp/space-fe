import {Vector3, Object3D, Line, Float32BufferAttribute, BufferGeometry, LineBasicMaterial} from 'three'


class EmptyHelper extends Object3D {

    constructor( object, size, color ) {

        super();

        this.object = object;

        this.matrix = object.matrixWorld;
        this.matrixAutoUpdate = false;

        this.color = color;

        this.type = 'EmptyHelper';

        if ( size === undefined ) size = 1;

        this.update();

    }

    dispose() {

    }

    update() {

        this.object.updateWorldMatrix( true, false );

    }

}


export { EmptyHelper };