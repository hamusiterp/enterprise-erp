import {
  ActivityIndicator,
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';

import { Colors } from '../../../../constants/colors';
import { Fonts } from '../../../../constants/fonts';

import {
  ItemStatus,
  itemsApi,
} from '../../../../api/itemsApi';


/*
|--------------------------------------------------------------------------
| Options - Same as Web ERP
|--------------------------------------------------------------------------
*/

const categoryOptions = [
  'Office Supplies',
  'IT Equipment',
  'Furniture',
  'Electrical',
  'Construction Materials',
  'Cleaning Supplies',
  'Vehicle Parts',
  'Other',
];

const unitOptions = [
  'Piece',
  'Box',
  'Pack',
  'Set',
  'Kilogram',
  'Gram',
  'Liter',
  'Meter',
  'Roll',
  'Carton',
];

const typeOptions = [
  'Product',
  'Material',
  'Asset',
  'Consumable',
  'Service',
];

const inventoryOptions = [
  'Stock',
  'Non-Stock',
];

type DropdownType =
  | 'category'
  | 'unit'
  | 'type'
  | null;


export default function CreateItemScreen() {

  const [
    category,
    setCategory,
  ] = useState('');

  const [
    unit,
    setUnit,
  ] = useState('');

  const [
    type,
    setType,
  ] = useState('');

  const [
    inventory,
    setInventory,
  ] = useState('Stock');

  const [
    productDate,
    setProductDate,
  ] = useState('');

  const [
    status,
    setStatus,
  ] = useState<ItemStatus>(
    'active'
  );

  const [
    itemDescription,
    setItemDescription,
  ] = useState('');

  const [
    activeDropdown,
    setActiveDropdown,
  ] =
    useState<DropdownType>(
      null
    );

  const [
    saving,
    setSaving,
  ] = useState(false);


  /*
  |--------------------------------------------------------------------------
  | Validation
  |--------------------------------------------------------------------------
  */

  const validate =
    (): boolean => {

      if (!category) {

        Alert.alert(
          'Required Field',
          'Category is required.'
        );

        return false;
      }

      if (!unit) {

        Alert.alert(
          'Required Field',
          'Unit is required.'
        );

        return false;
      }

      if (!type) {

        Alert.alert(
          'Required Field',
          'Item type is required.'
        );

        return false;
      }

      if (!inventory) {

        Alert.alert(
          'Required Field',
          'Inventory type is required.'
        );

        return false;
      }

      if (
        productDate.trim() &&
        !isValidDate(
          productDate.trim()
        )
      ) {

        Alert.alert(
          'Invalid Product Date',
          'Product date must use YYYY-MM-DD format.'
        );

        return false;
      }

      if (
        !itemDescription.trim()
      ) {

        Alert.alert(
          'Required Field',
          'Item description is required.'
        );

        return false;
      }

      if (
        itemDescription.trim()
          .length > 1000
      ) {

        Alert.alert(
          'Description Too Long',
          'Item description cannot exceed 1000 characters.'
        );

        return false;
      }

      return true;
    };


  /*
  |--------------------------------------------------------------------------
  | Save Item
  |--------------------------------------------------------------------------
  */

  const saveItem =
    async () => {

      if (
        saving ||
        !validate()
      ) {
        return;
      }

      try {

        setSaving(true);

        const created =
          await itemsApi.create({
            item_description:
              itemDescription.trim(),

            category,

            unit,

            type,

            inventory,

            product_date:
              productDate.trim()
                ? productDate.trim()
                : null,

            status,
          });

        Alert.alert(
          'Item Created',
          `${created.item_no} has been created successfully.`,
          [
            {
              text: 'View Item',

              onPress: () =>
                router.replace(
                  `/(app)/administration/items/${created.id}` as any
                ),
            },
          ]
        );

      } catch (error: any) {

        console.log(
          'CREATE ITEM ERROR:',
          error?.response?.data ??
          error
        );

        Alert.alert(
          'Unable to Create Item',
          getApiErrorMessage(
            error,
            'The item could not be created.'
          )
        );

      } finally {

        setSaving(false);

      }

    };


  /*
  |--------------------------------------------------------------------------
  | Screen
  |--------------------------------------------------------------------------
  */

  return (
    <SafeAreaView
      style={styles.safeArea}
    >

      <ScrollView
        contentContainerStyle={
          styles.container
        }
        showsVerticalScrollIndicator={
          false
        }
        keyboardShouldPersistTaps="handled"
      >

        {/* HEADER */}

        <View style={styles.header}>

          <Pressable
            style={styles.backButton}
            onPress={() =>
              router.back()
            }
          >
            <Ionicons
              name="arrow-back"
              size={22}
              color={Colors.text}
            />
          </Pressable>

          <View
            style={
              styles.headerContent
            }
          >
            <Text
              style={styles.title}
            >
              Add Item
            </Text>

            <Text
              style={styles.subtitle}
            >
              Create inventory master data
            </Text>
          </View>

        </View>


        {/* ITEM NUMBER */}

        <Text
          style={styles.sectionTitle}
        >
          Item Information
        </Text>

        <FormLabel
          title="Item Number"
        />

        <View
          style={[
            styles.inputContainer,
            styles.disabledInput,
          ]}
        >

          <Ionicons
            name="barcode-outline"
            size={19}
            color={
              Colors.textMuted
            }
          />

          <Text
            style={
              styles.generatedText
            }
          >
            Generated automatically
          </Text>

          <Ionicons
            name="lock-closed-outline"
            size={15}
            color={
              Colors.textMuted
            }
          />

        </View>


        {/* CATEGORY */}

        <FormLabel
          title="Category"
          required
        />

        <SelectField
          icon="folder-outline"
          value={category}
          placeholder="Select category"
          open={
            activeDropdown ===
            'category'
          }
          onPress={() =>
            setActiveDropdown(
              activeDropdown ===
                'category'
                ? null
                : 'category'
            )
          }
        />

        {activeDropdown ===
          'category' && (

          <OptionList
            values={
              categoryOptions
            }
            selected={category}
            onSelect={value => {

              setCategory(value);
              setActiveDropdown(null);

            }}
          />

        )}


        {/* UNIT */}

        <FormLabel
          title="Unit"
          required
        />

        <SelectField
          icon="layers-outline"
          value={unit}
          placeholder="Select unit"
          open={
            activeDropdown ===
            'unit'
          }
          onPress={() =>
            setActiveDropdown(
              activeDropdown ===
                'unit'
                ? null
                : 'unit'
            )
          }
        />

        {activeDropdown ===
          'unit' && (

          <OptionList
            values={unitOptions}
            selected={unit}
            onSelect={value => {

              setUnit(value);
              setActiveDropdown(null);

            }}
          />

        )}


        {/* ITEM TYPE */}

        <FormLabel
          title="Item Type"
          required
        />

        <SelectField
          icon="pricetag-outline"
          value={type}
          placeholder="Select item type"
          open={
            activeDropdown ===
            'type'
          }
          onPress={() =>
            setActiveDropdown(
              activeDropdown ===
                'type'
                ? null
                : 'type'
            )
          }
        />

        {activeDropdown ===
          'type' && (

          <OptionList
            values={typeOptions}
            selected={type}
            onSelect={value => {

              setType(value);
              setActiveDropdown(null);

            }}
          />

        )}


        {/* INVENTORY */}

        <FormLabel
          title="Inventory"
          required
        />

        <View
          style={
            styles.choiceRow
          }
        >

          {inventoryOptions.map(
            value => (

              <ChoiceButton
                key={value}
                title={value}
                icon={
                  value === 'Stock'
                    ? 'archive-outline'
                    : 'document-outline'
                }
                selected={
                  inventory === value
                }
                onPress={() =>
                  setInventory(value)
                }
              />

            )
          )}

        </View>


        {/* PRODUCT DATE */}

        <FormLabel
          title="Product Date"
        />

        <View
          style={
            styles.inputContainer
          }
        >

          <Ionicons
            name="calendar-outline"
            size={19}
            color={
              Colors.textSecondary
            }
          />

          <TextInput
            value={productDate}
            onChangeText={
              setProductDate
            }
            placeholder="YYYY-MM-DD"
            placeholderTextColor={
              Colors.textMuted
            }
            maxLength={10}
            keyboardType="numbers-and-punctuation"
            style={styles.input}
          />

        </View>

        <Text
          style={styles.helperText}
        >
          Optional • Use YYYY-MM-DD format
        </Text>


        {/* STATUS */}

        <FormLabel
          title="Status"
          required
        />

        <View
          style={
            styles.choiceRow
          }
        >

          <ChoiceButton
            title="Active"
            icon="checkmark-circle-outline"
            selected={
              status === 'active'
            }
            onPress={() =>
              setStatus('active')
            }
          />

          <ChoiceButton
            title="Inactive"
            icon="pause-circle-outline"
            selected={
              status === 'inactive'
            }
            onPress={() =>
              setStatus('inactive')
            }
          />

        </View>


        {/* DESCRIPTION */}

        <FormLabel
          title="Item Description"
          required
        />

        <View
          style={
            styles.textAreaContainer
          }
        >

          <TextInput
            value={
              itemDescription
            }
            onChangeText={
              setItemDescription
            }
            placeholder="Enter item description"
            placeholderTextColor={
              Colors.textMuted
            }
            multiline
            maxLength={1000}
            textAlignVertical="top"
            style={styles.textArea}
          />

          <Text
            style={
              styles.characterCount
            }
          >
            {itemDescription.length}/1000
          </Text>

        </View>


        {/* SAVE */}

        <Pressable
          disabled={saving}
          onPress={saveItem}
          style={[
            styles.saveButton,
            saving &&
              styles.disabled,
          ]}
        >

          {saving ? (

            <ActivityIndicator
              size="small"
              color={Colors.white}
            />

          ) : (

            <>
              <Ionicons
                name="save-outline"
                size={20}
                color={Colors.white}
              />

              <Text
                style={styles.saveText}
              >
                Save Item
              </Text>
            </>

          )}

        </Pressable>


        <Pressable
          disabled={saving}
          onPress={() =>
            router.back()
          }
          style={styles.cancelButton}
        >
          <Text
            style={styles.cancelText}
          >
            Cancel
          </Text>
        </Pressable>

      </ScrollView>

    </SafeAreaView>
  );
}


/*
|--------------------------------------------------------------------------
| Form Label
|--------------------------------------------------------------------------
*/

function FormLabel({
  title,
  required = false,
}: {
  title: string;
  required?: boolean;
}) {

  return (
    <View style={styles.labelRow}>

      <Text style={styles.label}>
        {title}
      </Text>

      {required && (
        <Text
          style={styles.required}
        >
          *
        </Text>
      )}

    </View>
  );
}


/*
|--------------------------------------------------------------------------
| Select Field
|--------------------------------------------------------------------------
*/

function SelectField({
  icon,
  value,
  placeholder,
  open,
  onPress,
}: {
  icon: any;
  value: string;
  placeholder: string;
  open: boolean;
  onPress: () => void;
}) {

  return (
    <Pressable
      style={[
        styles.selectField,
        open &&
          styles.selectOpen,
      ]}
      onPress={onPress}
    >

      <Ionicons
        name={icon}
        size={19}
        color={
          value
            ? Colors.primary
            : Colors.textSecondary
        }
      />

      <Text
        style={[
          styles.selectText,
          !value &&
            styles.placeholder,
        ]}
        numberOfLines={1}
      >
        {value || placeholder}
      </Text>

      <Ionicons
        name={
          open
            ? 'chevron-up'
            : 'chevron-down'
        }
        size={17}
        color={Colors.textMuted}
      />

    </Pressable>
  );
}


/*
|--------------------------------------------------------------------------
| Option List
|--------------------------------------------------------------------------
*/

function OptionList({
  values,
  selected,
  onSelect,
}: {
  values: string[];
  selected: string;
  onSelect: (
    value: string
  ) => void;
}) {

  return (
    <View
      style={
        styles.optionContainer
      }
    >

      {values.map(value => {

        const active =
          selected === value;

        return (
          <Pressable
            key={value}
            onPress={() =>
              onSelect(value)
            }
            style={[
              styles.option,
              active &&
                styles.optionSelected,
            ]}
          >

            <Text
              style={[
                styles.optionText,
                active &&
                  styles.optionTextSelected,
              ]}
            >
              {value}
            </Text>

            {active && (
              <Ionicons
                name="checkmark"
                size={18}
                color={Colors.primary}
              />
            )}

          </Pressable>
        );

      })}

    </View>
  );
}


/*
|--------------------------------------------------------------------------
| Choice Button
|--------------------------------------------------------------------------
*/

function ChoiceButton({
  title,
  icon,
  selected,
  onPress,
}: {
  title: string;
  icon: any;
  selected: boolean;
  onPress: () => void;
}) {

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.choiceButton,
        selected &&
          styles.choiceSelected,
      ]}
    >

      <Ionicons
        name={icon}
        size={20}
        color={
          selected
            ? Colors.primary
            : Colors.textSecondary
        }
      />

      <Text
        style={[
          styles.choiceText,
          selected &&
            styles.choiceTextSelected,
        ]}
      >
        {title}
      </Text>

    </Pressable>
  );
}


/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

function isValidDate(
  value: string
): boolean {

  if (
    !/^\d{4}-\d{2}-\d{2}$/
      .test(value)
  ) {
    return false;
  }

  const [
    year,
    month,
    day,
  ] =
    value
      .split('-')
      .map(Number);

  const date =
    new Date(
      year,
      month - 1,
      day
    );

  return (
    date.getFullYear() === year &&
    date.getMonth() ===
      month - 1 &&
    date.getDate() === day
  );
}


function getApiErrorMessage(
  error: any,
  fallback: string
): string {

  const errors =
    error?.response
      ?.data?.errors;

  if (errors) {

    const first =
      Object.values(errors)
        .flat()
        .find(Boolean);

    if (
      typeof first ===
      'string'
    ) {
      return first;
    }
  }

  return (
    error?.response
      ?.data?.message ??
    fallback
  );
}


/*
|--------------------------------------------------------------------------
| Styles
|--------------------------------------------------------------------------
*/

const styles =
  StyleSheet.create({

    safeArea: {
      flex: 1,
      backgroundColor:
        Colors.background,
    },

    container: {
      paddingHorizontal: 20,
      paddingTop: 12,
      paddingBottom: 50,
    },

    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },

    backButton: {
      width: 44,
      height: 44,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:
        Colors.surface,
      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    headerContent: {
      flex: 1,
      marginLeft: 13,
    },

    title: {
      fontSize: 22,
      fontFamily:
        Fonts.extraBold,
      color: Colors.text,
    },

    subtitle: {
      marginTop: 2,
      fontSize: 10,
      fontFamily:
        Fonts.regular,
      color:
        Colors.textSecondary,
    },

    sectionTitle: {
      marginTop: 18,
      marginBottom: 4,
      fontSize: 17,
      fontFamily:
        Fonts.extraBold,
      color: Colors.text,
    },

    labelRow: {
      marginTop: 17,
      marginBottom: 7,
      flexDirection: 'row',
      alignItems: 'center',
    },

    label: {
      fontSize: 11,
      fontFamily:
        Fonts.semiBold,
      color: Colors.text,
    },

    required: {
      marginLeft: 3,
      color: Colors.danger,
      fontFamily: Fonts.bold,
    },

    inputContainer: {
      minHeight: 53,
      paddingHorizontal: 14,
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 15,
      backgroundColor:
        Colors.surface,
      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    disabledInput: {
      opacity: 0.75,
      backgroundColor:
        Colors.surface,
    },

    generatedText: {
      flex: 1,
      marginHorizontal: 10,
      fontSize: 11,
      fontFamily:
        Fonts.medium,
      color:
        Colors.textMuted,
    },

    input: {
      flex: 1,
      marginLeft: 10,
      fontSize: 12,
      fontFamily:
        Fonts.regular,
      color: Colors.text,
    },

    selectField: {
      minHeight: 53,
      paddingHorizontal: 14,
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 15,
      backgroundColor:
        Colors.surface,
      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    selectOpen: {
      borderColor:
        Colors.primary,
    },

    selectText: {
      flex: 1,
      marginHorizontal: 10,
      fontSize: 12,
      fontFamily:
        Fonts.medium,
      color: Colors.text,
    },

    placeholder: {
      color:
        Colors.textMuted,
      fontFamily:
        Fonts.regular,
    },

    optionContainer: {
      marginTop: 6,
      overflow: 'hidden',
      borderRadius: 14,
      backgroundColor:
        Colors.surface,
      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    option: {
      minHeight: 47,
      paddingHorizontal: 14,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent:
        'space-between',
      borderBottomWidth: 1,
      borderBottomColor:
        Colors.border,
    },

    optionSelected: {
      backgroundColor:
        Colors.primaryLight,
    },

    optionText: {
      flex: 1,
      fontSize: 11,
      fontFamily:
        Fonts.medium,
      color: Colors.text,
    },

    optionTextSelected: {
      color: Colors.primary,
      fontFamily: Fonts.bold,
    },

    choiceRow: {
      flexDirection: 'row',
      gap: 9,
    },

    choiceButton: {
      flex: 1,
      minHeight: 53,
      paddingHorizontal: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 7,
      borderRadius: 15,
      backgroundColor:
        Colors.surface,
      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    choiceSelected: {
      borderColor:
        Colors.primary,
      backgroundColor:
        Colors.primaryLight,
    },

    choiceText: {
      fontSize: 11,
      fontFamily:
        Fonts.semiBold,
      color:
        Colors.textSecondary,
    },

    choiceTextSelected: {
      color: Colors.primary,
      fontFamily: Fonts.bold,
    },

    helperText: {
      marginTop: 6,
      marginLeft: 3,
      fontSize: 9,
      fontFamily:
        Fonts.regular,
      color: Colors.textMuted,
    },

    textAreaContainer: {
      minHeight: 150,
      padding: 14,
      borderRadius: 15,
      backgroundColor:
        Colors.surface,
      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    textArea: {
      minHeight: 105,
      fontSize: 12,
      lineHeight: 19,
      fontFamily:
        Fonts.regular,
      color: Colors.text,
    },

    characterCount: {
      marginTop: 5,
      textAlign: 'right',
      fontSize: 9,
      fontFamily:
        Fonts.regular,
      color: Colors.textMuted,
    },

    saveButton: {
      height: 55,
      marginTop: 30,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      borderRadius: 16,
      backgroundColor:
        Colors.primary,
    },

    saveText: {
      fontSize: 12,
      fontFamily:
        Fonts.bold,
      color: Colors.white,
    },

    cancelButton: {
      height: 50,
      marginTop: 10,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 15,
      backgroundColor:
        Colors.surface,
      borderWidth: 1,
      borderColor:
        Colors.border,
    },

    cancelText: {
      fontSize: 11,
      fontFamily:
        Fonts.semiBold,
      color:
        Colors.textSecondary,
    },

    disabled: {
      opacity: 0.55,
    },

  });