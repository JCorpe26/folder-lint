/** @format */

import noFeatureImport from './noFeatureImport';
import propTypeAliasesOnlyToChildren from './propTypeAliasesOnlyToChildren';
import requirePropsSuffix from './requirePropsSuffix';
import onlyIndexImportInFeature from './onlyIndexImport/rules/feature';
import onlyIndexImportInView from './onlyIndexImport/rules/view';
import onlyIndexImportInShared from './onlyIndexImport/rules/shared';

export default {
    'prop-type-aliases-only-to-children': propTypeAliasesOnlyToChildren,
    'require-props-suffix': requirePropsSuffix,
    'no-feature-import': noFeatureImport,
    'only-index-import-in-feature': onlyIndexImportInFeature,
    'only-index-import-in-view': onlyIndexImportInView,
    'only-index-import-in-shared': onlyIndexImportInShared
};
