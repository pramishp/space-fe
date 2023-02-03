import UIPanel, {UIPanelPosition} from "../components/UIPanel";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faLayerGroup} from "@fortawesome/free-solid-svg-icons";
import styled, {useTheme} from "styled-components";
import PropTypes from "prop-types";

export default function LayersPanel() {
    const theme = useTheme();
    return (
        <>
            <UIPanel position={UIPanelPosition.Left} headerLabel={"Layers"}>
                <ObjectItem objectName={'Cube is the longest name possible'} isActive={true}/>
                <ObjectItem objectName={'Cube02'} isActive={false}/>
                <ObjectItem objectName={'Sphere'} isActive={false}/>
                <ObjectItem objectName={'Camera'} isActive={false}/>
                <ObjectItem objectName={'Plane'} isActive={false}/>
            </UIPanel>
        </>
    )
}

export const LayerTypes = {
    Group: 'group',
    Object: 'Shape',
}


const ObjectItem = (props) => {
    const theme = useTheme()
    const Container = styled.div`
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      padding: 8px 20px;
      margin: 5px 10px;
      border-radius: 5px;
      background-color: ${({theme}) => props.isActive ? theme.colors.primary : 'transparent'};

      &:hover {
        background-color: ${({theme}) => props.isActive ? theme.colors.primary_shade_1 : theme.colors.hover};
        cursor: pointer;
      }
    `

    const IconAndLabelContainer = styled.div`
      display: flex;
      align-items: center;
      flex-direction: row;
      gap: 10px;
    `
    const Label = styled.div`
      color: ${({theme}) => props.isActive ? theme.colors.primaryText : theme.colors.tertiaryText};
      font-size: 0.8rem;
      font-weight: ${props.isActive ? 'bold' : 'normal'};

      overflow: hidden;
      max-height: 1rem;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 5;
      text-overflow: ellipsis;
      display: block;
    `

    return (
        <>
            <Container>
                <IconAndLabelContainer>
                    <FontAwesomeIcon size={"sm"} icon={faLayerGroup}
                                     color={props.isActive ? theme.colors.primaryText : theme.colors.tertiaryText}/>
                    <Label>{props.objectName}</Label>
                </IconAndLabelContainer>
            </Container>
        </>
    )
}

ObjectItem.propTypes = {
    objectName: PropTypes.string,
    isActive: PropTypes.bool,
}
