import UIPanel, {UIPanelPosition} from "../components/UIPanel";
import styled, {useTheme} from "styled-components";
import {toJSX} from "../common/loader";
import {useMultiplayerState} from "../space/hooks/useMultiplayerState";
import {roomID} from "../space/store";
import {useState} from "react";
import {Draggable, Droppable} from "@hello-pangea/dnd";

export default function ObjectsLibrary({data, setRefs}) {
    const {jsxs, refs} = toJSX(data);
    const [graph, setGraph] = useState(jsxs);
    const theme = useTheme();
    const {
        onMount,
        onChangePage,
        onInsertMesh,
        onDelete,
        onUndo,
        onRedo,
        loading,
        onChangePresence
    } = useMultiplayerState(roomID);


    const Container = styled.div`
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
      grid-gap: 20px;
      padding: 20px;
    `
    const ObjectListItem = styled.div`
      padding: 20px;
      border-radius:10px;
      background-color: ${({theme}) => theme.colors.card};
      color: ${({theme}) => theme.colors.primaryText};
    `
    console.log("JSXs :: ", jsxs);
    return (
        <>
            <div className="" style={{position: 'relative'}}>
                <UIPanel position={UIPanelPosition.Left} headerLabel={"Object Library"}>
                    <Droppable droppableId={'objects-library'}>
                        {(provided) => {
                            return (
                                <Container
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                >
                                    {Object.entries(graph).map(([uuid, item], index) => {
                                        return (
                                            <Draggable draggableId={uuid} index={index}>
                                                {(dropProvided) => {
                                                    return (
                                                        <>
                                                            <ObjectListItem
                                                                key={uuid}
                                                                ref={dropProvided.innerRef}
                                                                {...dropProvided.draggableProps}
                                                                {...dropProvided.dragHandleProps}
                                                            >
                                                                {uuid}
                                                            </ObjectListItem>
                                                        </>
                                                    )
                                                }}
                                            </Draggable>

                                        )
                                    })}
                                    {provided.placeholder}
                                </Container>
                            )
                        }}
                    </Droppable>

                </UIPanel>
            </div>
        </>
    )
}
