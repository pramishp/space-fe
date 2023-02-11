import React, { useState } from 'react';
import Tree, {TreeNode } from 'rc-tree';
import "rc-tree/assets/index.css"

export const AnimationTree = ({ slides, onDragAndDrop }) => {
    const [data, setData] = useState(
        Object.values(slides).reduce((acc, slide) => {
            Object.values(slide.animations).forEach(animation => {
                if (!acc[animation.order]) {
                    acc[animation.order] = [];
                }
                acc[animation.order].push({
                    key: animation.uuid,
                    title: `${animation.object_uuid} - ${animation.animation_uuid}`,
                });
            });
            return acc;
        }, {})
    );

    const onDrop = (info) => {
        const {dragNode} = info;
        const {node:{dropNode}} = info;
        onDragAndDrop({uuid: dragNode.key, to: dropNode.key});
    };

    return (
        <Tree draggable onDrop={onDrop}>
            {Object.entries(data).map(([order, animations]) => (
                <TreeNode title={`Order ${order}`} key={order}>
                    {animations.map(animation => (
                        <TreeNode key={animation.key} title={animation.title}/>
                    ))}
                </TreeNode>
            ))}
        </Tree>
    )

}
