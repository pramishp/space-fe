import styled, {useTheme} from "styled-components";
import PropTypes from "prop-types";


export default function UIPanel(props) {
    const {position} = props;

    const sideOffset = 20;
    const Panel = styled.div`
      position: absolute;
      z-index: 1;
      overflow: auto;
      resize: horizontal;
      top: 20px;
      ${position === UIPanelPosition.Left ? 'left:' + sideOffset + 'px;' : (position === UIPanelPosition.Right ? 'right:' + sideOffset + 'px;' : 'right:' + sideOffset + 'px;')}
      border-radius: 10px;
      height: ${window.innerHeight - 40}px;
      min-width: 200px;
      max-width: 600px;
      width: 300px;
      backdrop-filter: blur(4px);
      border: 1px solid ${({theme}) => theme.colors.border};
      background-color: ${({theme}) => theme.colors.menus};

      &:hover {
        backdrop-filter: blur(0px);
        background-color: ${({theme}) => theme.colors.body};
      }
    `
    return (
        <>
            <Panel>
                <Header title={props.headerLabel}/>
                {props.children}
            </Panel>
        </>
    );
}

const Header = (props) => {
    const Container = styled.div`
      padding: 10px 20px;
      display: flex;
      border-bottom: 1px solid ${({theme}) => theme.colors.border};
      margin-bottom: 20px;
    `
    const Label = styled.div`
      color: ${({theme}) => theme.colors.tertiaryText};
      font-size: 14px;
      font-weight: bold;
    `
    return (
        <>
            <Container>
                {/*<FontAwesomeIcon icon={faLayerGroup} color={theme.colors.tertiaryText}/>*/}
                <Label>{props.title}</Label>
            </Container>
        </>
    )
}
Header.propTypes = {
    label: PropTypes.string
}

export const UIPanelPosition = {
    Left: 'left',
    Right: 'right'
}


UIPanel.propTypes = {
    position: PropTypes.oneOf(Object.values(UIPanelPosition)),
    headerLabel: PropTypes.string

};

UIPanel.defaultProps = {
    position: UIPanelPosition.Left
}