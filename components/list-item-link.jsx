import { ListItem } from "@mui/material";
import Link from "next/link";

export default function ListItemLink({href, as, ...props}) {
    return <Link passHref href={href} as={as}>
        <ListItem button component="a" {...props}></ListItem>
    </Link>
}