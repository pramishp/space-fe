const Icon = ({ name, className,...rest }) => {
    const iconPath = `/icons/${name}.svg`;

    return <img src={iconPath}
                alt={name}
                className={className?`icon-large ${className}`: 'icon-large'}
                {...rest} />;
};

export default Icon;