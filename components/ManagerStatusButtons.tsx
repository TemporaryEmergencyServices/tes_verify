import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

// TODO: finish modularizing
export default function ManagerStatusButtons(props: any) {
    // const { key, type, clockRef, approve, deny}
    return (
        <View>
            <TouchableOpacity onPress={() => {props.approve()}}>
                <Text style={styles.approved}>approve</Text>
            </TouchableOpacity> 
            <TouchableOpacity>
                <Text onPress={() => {props.deny()}} style={styles.denied}>deny</Text>
            </TouchableOpacity> 
        </View>  
    )
}

const styles = StyleSheet.create({
    approved: {
        color: 'green'
    }, 
    denied: {
        color: 'red'
    }
});

