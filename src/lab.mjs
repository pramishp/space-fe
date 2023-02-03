import * as Y from 'yjs'

const doc = new Y.Doc()

const yObjs = doc.getMap('objects')


yObjs.observeDeep(events => {
    // console.log(events.changes.keys)
    events.forEach(event => {
        // event.changes.keys
        const parents = Array.from(event.transaction.changedParentTypes)
        const level = parents.length
        console.log(level)
        event.changes.keys.forEach((val, key) => {
            if (level === 2){
                const uuid = Array.from(parents[1][0]._map.keys())[1]
                console.log('uuid', uuid)
            }
            console.log(key, val.action)
        })
    });
});

doc.transact(() => {
    // add a cube
    const subMap2 = new Y.Map()
    subMap2.set('position', [1,1,1])
    subMap2.set('position', [1,2,1])
    yObjs.set('cube1', subMap2)
    // ymap.set('cube2', {})
})

doc.transact(() => {

    // edit properties
    const sub = yObjs.get('cube1');
    sub.set('position', [1,1,1])
    sub.set('rotation', [1,2,1])
})

doc.transact(() => {
    // delete cube 1
    yObjs.delete('cube1')
})


