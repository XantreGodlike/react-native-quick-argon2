// Copyright 2023 Xantre
#pragma once

#include <memory>

#include "../argon2/include/argon2.h"
#include "JSIUtils/RNA2DispatchQueue.h"

namespace rnargon2 {

using ustring = std::vector<uint8_t>;

struct Options {
    ustring secret;
    ustring ad;

    uint32_t hash_length;
    uint32_t time_cost;
    uint32_t memory_cost;
    uint32_t parallelism;
    uint32_t version;

    argon2_type type;
};
static argon2_context make_context(uint8_t *buf, ustring &plain, ustring &salt,
                                   Options &opts);

}  // namespace rnargon2
